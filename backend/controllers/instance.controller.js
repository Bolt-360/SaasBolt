import models from '../models/index.js';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const { Instance, Workspace } = models;
const EVOLUTION_API_URL = process.env.URL_EVOLUTION_API;
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;

export const createInstance = async (req, res, io) => {
    console.log('Iniciando createInstance');
    console.log('Dados recebidos:', req.body);

    try {
        const { name, phoneNumber, status, workspaceId } = req.body;

        if (!name || !workspaceId) {
            console.log('Dados obrigatórios faltando');
            return res.status(400).json({ message: "Nome e ID do workspace são obrigatórios" });
        }

        let evolutionApiResponse;
        try {
            // Criar instância na Evolution API com timeout de 10 segundos
            evolutionApiResponse = await axios.post(`${EVOLUTION_API_URL}/instance/create`, {
                instanceName: name,
                token: name, // Usando o nome como token, ajuste conforme necessário
                number: phoneNumber,
                qrcode: true,
                integration: "WHATSAPP-BAILEYS",
                // Adicione outros parâmetros conforme necessário
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': EVOLUTION_API_KEY
                },
                timeout: 10000 // 10 segundos de timeout
            });

            console.log('Resposta da Evolution API:', evolutionApiResponse.data);
        } catch (evolutionError) {
            console.error('Erro ao criar instância na Evolution API:', evolutionError.message);
            if (evolutionError.response) {
                console.error('Detalhes do erro:', evolutionError.response.data);
            }
            throw new Error('Falha ao criar instância na Evolution API');
        }

        const instanceData = {
            id: evolutionApiResponse.data.instance.instanceId,
            name: evolutionApiResponse.data.instance.instanceName,
            status: evolutionApiResponse.data.instance.status.toUpperCase(),
            workspaceId,
            phoneNumber
        };

        const instance = await Instance.create(instanceData);

        const InstanceReturns = {
            requestData: req.body,
            createdInstance: instance.toJSON(),
            evolutionApiResponse: evolutionApiResponse ? evolutionApiResponse.data : null
        };

        if (io && typeof io.emit === 'function') {
            console.log('Emitindo evento instanceCreated');
            io.emit('instanceCreated', InstanceReturns);
        } else {
            console.warn('Socket.io não está disponível para emitir eventos');
        }

        res.status(201).json(InstanceReturns);
    } catch (error) {
        console.error('Erro ao criar instância:', error);
        if (error.name === 'SequelizeValidationError') {
            const validationErrors = error.errors.map(err => ({
                field: err.path,
                message: err.message
            }));
            return res.status(400).json({ message: "Erro de validação", errors: validationErrors });
        }
        res.status(500).json({ message: "Erro ao criar instância", error: error.message });
    }
};

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

export const updateInstance = async (req, res, io) => {
    try {
        const instance = await Instance.findByPk(req.params.id);
        if (instance) {
            await instance.update(req.body);

            // Após atualizar a instância com sucesso
            io.emit('instanceUpdated', instance);

            res.status(200).json(instance);
        } else {
            res.status(404).json({ message: 'Instância não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteInstance = async (req, res, io) => {
    try {
        const instance = await Instance.findByPk(req.params.id);
        if (instance) {
            await instance.destroy();

            // Após deletar a instância com sucesso
            io.emit('instanceDeleted', { id: req.params.id });

            res.status(200).json({ message: 'Instance deleted successfully' });
        } else {
            res.status(404).json({ message: 'Instância não encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Adicionando a função getInstancesByWorkspace
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

export const connectInstance = async (req, res) => {
    try {
        const { instanceName } = req.params;

        // Primeiro, encontre a instância no nosso banco de dados
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

        // Verificar o status retornado pela API Evolution e ajustar conforme necessário
        let newStatus = response.data.status ? response.data.status.toUpperCase() : 'CONNECTING';
        if (!['CONNECTED', 'DISCONNECTED', 'WAITING_QR', 'CONNECTING'].includes(newStatus)) {
            newStatus = 'CONNECTING';
        }

        // Atualizar o status da instância no nosso banco de dados
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
        console.error('Erro ao conectar instância:', error);
        res.status(500).json({ message: "Erro ao conectar instância", error: error.message });
    }
};
