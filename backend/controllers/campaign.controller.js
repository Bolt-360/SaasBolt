import models from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
import minioClient from '../config/minio.js';
import { startCampaign } from '../services/campaignService.js';
import { io } from '../socket/socket.js';

const { Campaign } = models;
const BUCKET_NAME = process.env.MINIO_BUCKET_NAME || 'campaigns';

export const createCampaign = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        
        // Verificar se tem arquivo CSV
        if (!req.files || !req.files.csv) {
            throw new Error('Arquivo CSV é obrigatório');
        }

        const csvFile = req.files.csv;
        const fileName = `${workspaceId}/csv/${uuidv4()}-${csvFile.name}`;

        // Garantir que o bucket existe
        try {
            const bucketExists = await minioClient.bucketExists(BUCKET_NAME);
            if (!bucketExists) {
                await minioClient.makeBucket(BUCKET_NAME);
            }
        } catch (error) {
            console.error('Erro ao verificar/criar bucket:', error);
            throw new Error('Erro ao configurar armazenamento');
        }

        // Upload do arquivo para o MinIO
        await minioClient.putObject(
            BUCKET_NAME,
            fileName,
            csvFile.data,
            csvFile.size,
            csvFile.mimetype
        );

        // Processar outros dados da campanha
        const campaignData = {
            ...req.body,
            workspaceId: parseInt(workspaceId),
            startImmediately: req.body.startImmediately === 'true',
            messageInterval: parseInt(req.body.messageInterval),
            instanceIds: JSON.parse(req.body.instanceIds),
            messages: JSON.parse(req.body.messages),
            csvFileUrl: `${BUCKET_NAME}/${fileName}` // Salvar a URL do arquivo
        };

        const campaign = await Campaign.create(campaignData);
        
        io.to(`workspace_${workspaceId}`).emit('campaignCreated', campaign);
        
        res.status(201).json(campaign);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCampaigns = async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        
        const campaigns = await Campaign.findAll({
            where: {
                workspaceId: workspaceId
            },
            order: [['createdAt', 'DESC']]
        });

        // Retorna array vazio se não houver campanhas
        return res.status(200).json(campaigns || []);
        
    } catch (error) {
        console.error("Erro ao buscar campanhas:", error);
        return res.status(500).json({ 
            message: "Erro ao buscar campanhas", 
            error: error.message 
        });
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
        const campaign = await Campaign.findByPk(id);
        
        if (!campaign) {
            return res.status(404).json({ message: 'Campanha não encontrada' });
        }
        
        await campaign.update(req.body);
        
        // Emitir evento de socket para o workspace específico
        io.to(`workspace_${campaign.workspaceId}`).emit('campaignUpdated', campaign);
        
        res.json(campaign);
    } catch (error) {
        console.error('Erro ao atualizar campanha:', error);
        res.status(500).json({ error: error.message });
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
