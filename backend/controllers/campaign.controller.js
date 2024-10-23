import models from '../models/index.js';
import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';
import path from 'path';
import { scheduleJob } from 'node-schedule';
import { startCampaign } from '../services/campaignService.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import minioClient from '../config/minio.js';
import { DataTypes } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { Campaign, CampaignMessage, Instance } = models;

const BASE_DIR = process.env.BASE_DIR || process.cwd();

export const createCampaign = async (req, res) => {
    try {
        const { 
            name, 
            type, 
            startImmediately, 
            startDate, 
            messageInterval, 
            messages, 
            workspaceId, 
            instanceIds 
        } = req.body;

        // Criar a campanha no banco de dados
        const campaign = new Campaign({
            name,
            type,
            startImmediately,
            startDate,
            messageInterval,
            messages: JSON.parse(messages),
            instanceIds: JSON.parse(instanceIds),
        });

        // Processar o arquivo CSV
        if (req.files && req.files.csv) {
            const csvFile = req.files.csv;
            const bucketName = process.env.MINIO_BUCKET || 'campaigns';
            const objectName = `${Date.now()}-${csvFile.name}`;

            try {
                // Verifica se o bucket existe, se não, cria
                const bucketExists = await minioClient.bucketExists(bucketName);
                if (!bucketExists) {
                    await minioClient.makeBucket(bucketName);
                }

                // Faz o upload do arquivo para o MinIO
                await minioClient.putObject(bucketName, objectName, csvFile.data);

                // Salva apenas o nome do objeto no banco de dados
                campaign.csvFileUrl = objectName;
            } catch (minioError) {
                console.error('Erro ao processar arquivo no MinIO:', minioError);
                return res.status(500).json({ message: 'Erro ao processar arquivo CSV' });
            }
        } else {
            console.log('Nenhum arquivo CSV foi enviado');
        }

        // Processar a imagem, se existir
        if (req.files && req.files.image) {
            const imageFile = req.files.image;
            const bucketName = process.env.MINIO_BUCKET || 'campaigns';
            const objectName = `${Date.now()}-${imageFile.name}`;

            try {
                // Faz o upload da imagem para o MinIO
                await minioClient.putObject(bucketName, objectName, imageFile.data);

                // Gera a URL da imagem
                const imageUrl = await minioClient.presignedGetObject(bucketName, objectName, 24*60*60); // URL válida por 24 horas

                // Salva a URL da imagem no modelo de campanha
                campaign.imageUrl = imageUrl;
            } catch (minioError) {
                console.error('Erro ao processar imagem no MinIO:', minioError);
                return res.status(500).json({ message: 'Erro ao processar imagem' });
            }
        }

        // Salvar a campanha no banco de dados
        await campaign.save();

        res.status(201).json(campaign);
    } catch (error) {
        console.error('Erro ao criar campanha:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getCampaigns = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const campaigns = await Campaign.findAll({
            where: { workspaceId },
            include: [CampaignMessage]
        });
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findByPk(req.params.id, {
            include: [CampaignMessage]
        });
        if (campaign) {
            res.status(200).json(campaign);
        } else {
            res.status(404).json({ message: 'Campanha não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, scheduledDate, messages } = req.body;

        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campanha não encontrada' });
        }

        await campaign.update({ name, type, scheduledDate });

        // Atualizar mensagens
        await CampaignMessage.destroy({ where: { campaignId: id } });
        await CampaignMessage.bulkCreate(messages.map(message => ({
            ...message,
            campaignId: id
        })));

        // Reagendar a campanha
        scheduleJob(scheduledDate, () => startCampaign(id));

        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findByPk(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campanha não encontrada' });
        }

        await campaign.destroy();
        res.status(200).json({ message: 'Campanha deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
