import models from '../models/index.js';
import { io } from '../socket/socket.js';
import { getInstanceById } from './instance.controller.js';

const { Instance } = models;

export const handleWebhook = async (req, res) => {
    console.log('Webhook recebido');
    try {
        const { instanceName, event, data } = req.body;

        console.log(`Instância: ${instanceName}`);
        console.log(`Evento: ${event}`);
        console.log('Dados:', JSON.stringify(data, null, 2));

        switch (event) {
            case 'qrcode.updated':
                console.log('QR Code atualizado');
                await Instance.update({ qrcode: data.qrcode.base64 }, { where: { name: data.qrcode.instance } });
                io.emit('qrcodeUpdated', { instance: data.qrcode.instance, qrcode: data.qrcode.base64 });
                break;
            case 'connection.update':
                console.log(`Status da conexão atualizado para: ${data.status}`);
                await Instance.update({ status: data.status.toUpperCase() }, { where: { name: instanceName } });
                const instance = await getInstanceById(instanceName);
                io.emit('connectionUpdate', { instance });
                break;
            default:
                console.log(`Evento não tratado: ${event}`);
        }

        res.status(200).json({ message: 'Webhook processado com sucesso' });
    } catch (error) {
        console.error('Erro ao processar webhook:', error);
        res.status(500).json({ message: 'Erro ao processar webhook', error: error.message });
    }
};
