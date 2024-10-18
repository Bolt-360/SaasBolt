import models from '../models/index.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const { Instance, Workspace } = models;
const EVOLUTION_API_URL = process.env.URL_EVOLUTION_API;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;

// Função para configurar o webhook após a criação da instância
const configureWebhook = async (instanceName, workspaceId) => {
    const webhookUrl = `${process.env.BASE_URL}/webhook/instance-events`;

    return axios.post(`${EVOLUTION_API_URL}/webhook/set/${workspaceId}-${instanceName}`, {
        webhook: {
            enabled: true,
            url: webhookUrl,
            webhookByEvents: true,
            webhookBase64: true,
            events: ["QRCODE_UPDATED", "CONNECTION_UPDATE"]
        }
    }, {
        headers: {
            'Content-Type': 'application/json',
            'apikey': EVOLUTION_API_KEY
        },
        timeout: 10000
    });
};

// Função para criar uma nova instância
export const createInstance = async (req, res, io) => {
    try {
        const { name } = req.body;
        const workspaceId = req.params.workspaceId;

        if (!name || !workspaceId) {
            return res.status(400).json({ message: "Nome e ID do workspace são obrigatórios" });
        }

        // Passo 1: Criar a instância
        let evolutionApiResponse;
        try {
            evolutionApiResponse = await axios.post(`${EVOLUTION_API_URL}/instance/create`, {
                instanceName: workspaceId + "-" + name,
                frontName: name,
                token: name,
                qrcode: true,
                integration: "WHATSAPP-BAILEYS"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': EVOLUTION_API_KEY
                },
                timeout: 10000
            });

        } catch (evolutionError) {
            throw new Error('Falha ao criar instância na Evolution API');
        }

        // Passo 2: Configurar o webhook
        try {
            const webhookResponse = await configureWebhook(name, workspaceId);
            console.log("Webhook configurado com sucesso", webhookResponse.data);
        } catch (webhookError) {
            console.log("Falha ao configurar webhook", webhookError, configureWebhook);
            throw new Error('Falha ao configurar webhook'); 
            
        }

        const instanceData = {
            id: evolutionApiResponse.data.instance.instanceId,
            name: evolutionApiResponse.data.instance.instanceName,
            status: evolutionApiResponse.data.instance.status.toUpperCase(),
            workspaceId
        };

        const instance = await Instance.create(instanceData);

        const InstanceReturns = {
            createdInstance: instance.toJSON(),
            evolutionApiResponse: evolutionApiResponse.data
        };

        if (io && typeof io.emit === 'function') {
            io.emit('instanceCreated', InstanceReturns);
        }

        res.status(201).json(InstanceReturns);
    } catch (error) {
        res.status(500).json({ message: "Erro ao criar instância", error: error.message });
    }
};

// Função para buscar todas as instâncias
export const getAllInstances = async (req, res) => {
    try {
        const instances = await Instance.findAll({
            include: [Workspace]
        });
        res.status(200).json(instances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para buscar uma instância por ID
export const getInstanceById = async (req, res) => {
    try {
        const instance = await Instance.findByPk(req.params.id, {
            include: [Workspace]
        });
        if (instance) {
            res.status(200).json(instance);
        } else {
            res.status(404).json({ message: 'Instância não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para atualizar uma instância
export const updateInstance = async (req, res, io) => {
    try {
        const instance = await Instance.findByPk(req.params.id);
        if (instance) {
            await instance.update(req.body);

            // Após atualizar a instância com sucesso
            if (io && typeof io.emit === 'function') {
                io.emit('instanceUpdated', instance);
            }

            res.status(200).json(instance);
        } else {
            res.status(404).json({ message: 'Instância não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para deletar uma instância
export const deleteInstance = async (req, res, io) => {
    try {
        const instance = await Instance.findByPk(req.params.id);
        if (instance) {
            await instance.destroy();

            // Após deletar a instância com sucesso
            if (io && typeof io.emit === 'function') {
                io.emit('instanceDeleted', { id: req.params.id });
            }

            res.status(200).json({ message: 'Instância deletada com sucesso' });
        } else {
            res.status(404).json({ message: 'Instância não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para buscar instâncias de um workspace específico
export const getInstancesByWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const instances = await Instance.findAll({
            where: { workspaceId },
            include: [Workspace]
        });
        res.status(200).json(instances);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Função para conectar uma instância usando a Evolution API
export const connectInstance = async (req, res) => {
    try {
        const { instanceName } = req.params;

        // Primeiro, encontre a instância no banco de dados
        const instance = await Instance.findOne({ where: { name: instanceName } });

        if (!instance) {
            return res.status(404).json({ message: "Instância não encontrada" });
        }

        // Use o nome da instância para conectar na Evolution API
        const response = await axios.get(`${EVOLUTION_API_URL}/instance/connect/${instanceName}`, {
            headers: {
                'Content-Type': 'application/json',
                'apikey': EVOLUTION_API_KEY
            }
        });

        // Verificar o status retornado pela Evolution API
        let newStatus = response.data.status ? response.data.status : 'CONNECTING';
        if (!['CONNECTED', 'DISCONNECTED', 'WAITING_QR', 'CONNECTING'].includes(newStatus)) {
            newStatus = 'CONNECTING';
        }

        // Atualizar o status da instância no banco de dados
        await instance.update({ status: newStatus });

        res.status(200).json({
            message: "Instância conectada com sucesso",
            instance: {
                id: instance.id,
                name: instance.name,
                status: newStatus
            },
            evolutionApiResponse: response.data
        });
    } catch (error) {
        res.status(500).json({ message: "Erro ao conectar instância", error: error.message });
    }
};
