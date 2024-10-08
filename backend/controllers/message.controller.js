import { Op } from 'sequelize';
import models from '../models/index.js';

const { User, Message, Conversation } = models;

export const sendMessage = async (req, res) => {
    try {
        const authUserId = req.user.id;
        const { id: recipientId } = req.params;
        const recipientIdInt = parseInt(recipientId, 10);
        const { message } = req.body;

        console.log('Mensagem:', message);
        console.log('RecipientId:', recipientIdInt);
        console.log('AuthUserId:', authUserId);

        if (!message) {
            return res.status(400).json({ message: 'O conteúdo da mensagem é obrigatório' });
        }

        // Verificar se os dois participantes são válidos
        const authUser = await User.findByPk(authUserId);
        const recipientUser = await User.findByPk(recipientIdInt);

        if (!authUser || !recipientUser) {
            return res.status(404).json({ message: 'Um dos usuários não foi encontrado' });
        }

        // Verificar se já existe uma conversa entre esses dois participantes
        let conversation = await Conversation.findOne({
            where: {
                participants: {
                    [Op.contains]: [authUserId, recipientIdInt],
                },
            },
        });

        // Se a conversa não existir, criar uma nova
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [authUserId, recipientIdInt],
            });

            // Associar os usuários à conversa
            await conversation.addParticipantUsers([authUserId, recipientIdInt]);
        }

        // Enviar a mensagem associada à conversa
        const newMessage = await Message.create({
            conversationId: conversation.id,
            senderId: authUserId,
            recipientId: recipientIdInt,
            content: message,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        return res.status(200).json({
            message: 'Mensagem enviada com sucesso',
            data: newMessage,
        });
    } catch (error) {
        console.error('Erro detalhado:', error);
        return res.status(500).json({ message: 'Erro ao enviar a mensagem', error: error.message });
    }
};

export const getMessage = async (req, res, next) => {
    try {
        const { id: userToMessage } = req.params; // ID do usuário com quem o remetente está conversando
        const senderId = req.user.id; // ID do usuário autenticado

        // Buscar todas as mensagens entre o senderId (usuário autenticado) e userToMessage (usuário da URL)
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    {
                        senderId: senderId,
                        recipientId: userToMessage,
                    },
                    {
                        senderId: userToMessage,
                        recipientId: senderId,
                    },
                ],
            },
            order: [['createdAt', 'ASC']], // Ordenar cronologicamente pela data de criação
        });

        // Sempre retornar 200 OK com o array de mensagens (vazio se não houver mensagens)
        return res.status(200).json(messages);
    } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
        return next(error); // Encaminhar erro para o middleware de erro
    }
};
