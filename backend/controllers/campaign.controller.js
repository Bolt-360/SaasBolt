import models from '../models/index.js';

const { Campaign, Workspace, Instance } = models;

export const createCampaign = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { name, type, startDate, messageInterval, instanceId } = req.body;
        const campaign = await Campaign.create({
            name,
            type,
            status: 'TO_START',
            startDate,
            messageInterval,
            instanceId,
            workspaceId
        });
        res.status(201).json(campaign);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllCampaigns = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const campaigns = await Campaign.findAll({
            where: { workspaceId },
            include: [Workspace, Instance]
        });
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findByPk(req.params.id, {
            include: [Workspace, Instance]
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
        const campaign = await Campaign.findByPk(req.params.id);
        if (campaign) {
            await campaign.update(req.body);
            res.status(200).json(campaign);
        } else {
            res.status(404).json({ message: 'Campanha não encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCampaign = async (req, res) => {
    try {
        const campaign = await Campaign.findByPk(req.params.id);
        if (campaign) {
            await campaign.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Campanha não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
