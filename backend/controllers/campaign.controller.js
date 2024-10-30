import models from "../models/index.js";
import { v4 as uuidv4 } from "uuid";
import minioClient from "../config/minio.js";
import { startCampaign } from "../services/campaignService.js";
import { io } from "../socket/socket.js";
import { getMediaBase64 } from '../utils/getMediaBase64.js';
import axios from "axios";

const { Campaign } = models;
const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || "campaigns";

export const createCampaign = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;
    const { csv, media } = req.files;

    if (!csv) {
      throw new Error("Arquivo CSV é obrigatório");
    }

    // Processa o CSV
    const csvFileName = `${workspaceId}/csv/${uuidv4()}-${csv.name}`;
    await minioClient.putObject(
      BUCKET_NAME,
      csvFileName,
      csv.data,
      csv.size,
      csv.mimetype
    );

    // Processa a mídia se existir
    let mediaBase64 = null;
    let mediaType = null;
    let mediaFileName = null;
    let mediaMediaType = null;
    
    if (media) {
      mediaFileName = `${workspaceId}/media/${uuidv4()}-${media.name}`;
      
      // Determina o tipo de mídia baseado na extensão
      const extension = media.name.toLowerCase().split('.').pop();
      const isDocument = ['pdf', 'doc', 'docx'].includes(extension);
      
      mediaMediaType = isDocument ? "document" : "image";
      
      await minioClient.putObject(
        BUCKET_NAME,
        mediaFileName,
        media.data,
        media.size,
        media.mimetype
      );

      // Converte para base64
      const base64 = await getMediaBase64(BUCKET_NAME, mediaFileName);
      mediaBase64 = base64;
      mediaType = media.mimetype;
      mediaFileName = media.name;
      
      console.log(`\x1b[34m[Debug]\x1b[0m ${mediaMediaType.toUpperCase()} convertido para base64`);
    }

    // Processa as mensagens
    let messages = JSON.parse(req.body.messages);
    if (mediaBase64) {
      messages = messages.map(msg => ({
        ...msg,
        mediaUrl: mediaBase64,
        mimetype: mediaType,
        fileName: mediaFileName,
        mediatype: mediaMediaType
      }));
    }

    const campaignData = {
      ...req.body,
      workspaceId: parseInt(workspaceId),
      startImmediately: req.body.startImmediately === "true",
      messageInterval: parseInt(req.body.messageInterval),
      instanceIds: JSON.parse(req.body.instanceIds),
      messages,
      csvFileUrl: `${BUCKET_NAME}/${csvFileName}`,
      status: 'PENDING',
      isActive: true
    };

    const campaign = await Campaign.create(campaignData);
    
    console.log(`\x1b[34m[Debug]\x1b[0m Campanha criada com sucesso ${mediaMediaType ? `(com ${mediaMediaType})` : ''}`);
    
    io.to(`workspace_${workspaceId}`).emit("campaignCreated", campaign);
    
    res.status(201).json(campaign);

  } catch (error) {
    console.error('Erro ao criar campanha:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const workspaceId = req.params.workspaceId;

    const campaigns = await Campaign.findAll({
      where: {
        workspaceId: workspaceId,
        isActive: true
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(campaigns || []);
  } catch (error) {
    console.error("Erro ao buscar campanhas:", error);
    return res.status(500).json({
      message: "Erro ao buscar campanhas",
      error: error.message,
    });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      where: {
        id: req.params.id,
        isActive: true
      },
      include: [CampaignMessage],
    });

    if (campaign) {
      res.status(200).json(campaign);
    } else {
      res.status(404).json({ message: "Campanha não encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findOne({
      where: {
        id: id,
        isActive: true
      }
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campanha não encontrada" });
    }

    await campaign.update(req.body);

    io.to(`workspace_${campaign.workspaceId}`).emit(
      "campaignUpdated",
      campaign
    );

    res.json(campaign);
  } catch (error) {
    console.error("Erro ao atualizar campanha:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCampaign = async (req, res) => {
  try {
    const { workspaceId, campaignId } = req.params;

    const campaign = await Campaign.findOne({
      where: {
        id: campaignId,
        workspaceId: workspaceId,
        isActive: true
      },
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campanha não encontrada" });
    }

    await campaign.update({ isActive: false });

    io.to(`workspace_${workspaceId}`).emit('campaignDeleted', {
      campaignId,
      workspaceId
    });

    res.status(200).json({ message: "Campanha deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
