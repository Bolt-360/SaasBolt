import models from '../models/index.js';
import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';
import { sendMessage } from './messageService.js';
import { io } from '../socket/socket.js';

const { Campaign, CampaignMessage, Instance } = models;

export const startCampaign = async (campaignId) => {
  const campaign = await Campaign.findByPk(campaignId, {
    include: [CampaignMessage, Instance]
  });

  if (!campaign) {
    console.error(`Campanha ${campaignId} não encontrada`);
    return;
  }

  campaign.status = 'IN_PROGRESS';
  await campaign.save();

  const csvContent = await fs.readFile(campaign.csvFilePath, 'utf-8');
  const records = parse(csvContent, { columns: true, skip_empty_lines: true });

  let currentInstanceIndex = 0;

  for (const record of records) {
    for (const message of campaign.CampaignMessages) {
      try {
        let content = message.content;
        for (const [key, value] of Object.entries(record)) {
          content = content.replace(`{${key}}`, value);
        }

        if (message.variations && message.variations.length > 0) {
          const randomVariation = message.variations[Math.floor(Math.random() * message.variations.length)];
          content = randomVariation.replace(/\{(\w+)\}/g, (match, key) => record[key] || match);
        }

        const instance = campaign.Instances[currentInstanceIndex];
        await sendMessage({
          type: message.type,
          content: { text: content },
          recipientPhone: record.contato,
          instanceName: instance.name
        });

        campaign.sentMessages += 1;
        await campaign.save();

        currentInstanceIndex = (currentInstanceIndex + 1) % campaign.Instances.length;

        await new Promise(resolve => setTimeout(resolve, campaign.messageInterval * 1000));

      } catch (error) {
        console.error(`Erro ao enviar mensagem para ${record.contato}:`, error);
        campaign.failedMessages += 1;
        await campaign.save();
      }
    }
  }

  campaign.status = 'COMPLETED';
  await campaign.save();
  updateCampaignStatus(campaign);
};

const updateCampaignStatus = (campaign) => {
  io.to(`instance-${campaign.instanceName}`).emit('campaignUpdate', {
    id: campaign.id,
    status: campaign.status,
    sentMessages: campaign.sentMessages,
    failedMessages: campaign.failedMessages
  });
};
