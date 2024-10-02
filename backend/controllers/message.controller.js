import { Op } from "sequelize";
import models from '../models/index.js';
import sequelize from '../config/database.js';

const { User, Message, Conversation, ConversationParticipants } = models;

export const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        // Converter IDs para Inteiros
        const senderIdInt = parseInt(senderId);
        const receiverIdInt = parseInt(receiverId);

        // Verificar se os IDs são válidos
        if (isNaN(senderIdInt) || isNaN(receiverIdInt)) {
            return res.status(400).json({ message: "IDs inválidos" });
        }

        // Buscar a conversa com ambos os participantes
        let conversation = await Conversation.findOne({
            where: {
                participants: {
                    [Op.contains]: [senderIdInt, receiverIdInt]
                }
            }
        });

        // Criar nova conversa se não existir
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderIdInt, receiverIdInt],
                messageIds: []
            });

            // Adicionar os participantes à conversa
            await ConversationParticipants.bulkCreate([
                { conversationId: conversation.id, userId: senderIdInt },
                { conversationId: conversation.id, userId: receiverIdInt }
            ], { 
                ignoreDuplicates: true
            });
        } else {
            next(errorHandler(404, "Conversa não encontrada"));
        }

        // Criar nova mensagem
        const newMessage = await Message.create({
            senderId: senderIdInt,
            recipientId: receiverIdInt,
            text: message,
            conversationId: conversation.id
        });

        // Adicionar o ID da nova mensagem ao array messageIds
        await conversation.update({
            messageIds: sequelize.fn('array_append', sequelize.col('messageIds'), newMessage.id)
        });

        // Retornar a nova mensagem criada
        res.status(201).json(newMessage);
    } catch (error) {
        next(error);
    }
};


export const getMessage = async (req, res, next) => {
    try {
        const { id: messageId } = req.params;

        // Converter ID para Inteiro
        const messageIdInt = parseInt(messageId);

        // Verificar se o ID é válido
        if (isNaN(messageIdInt)) {
            return res.status(400).json({ message: "ID de mensagem inválido" });
        }

        // Buscar a mensagem pelo ID
        const message = await Message.findOne({
            where: { id: messageIdInt },
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'username', 'profilePicture'] // Retorna dados relevantes do remetente
                },
                {
                    model: User,
                    as: 'recipient',
                    attributes: ['id', 'username', 'profilePicture'] // Retorna dados relevantes do destinatário
                },
                {
                    model: Conversation,
                    as: 'conversation',
                    attributes: ['id', 'participants'] // Retorna dados da conversa, incluindo participantes
                }
            ]
        });

        if (!message) {
            return res.status(404).json({ message: "Mensagem não encontrada" });
        }
        // Retornar a mensagem encontrada
        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
};