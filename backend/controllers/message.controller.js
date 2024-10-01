import { Op } from "sequelize";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

export const sendMessage = async (req, res, next) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        // Ter certeza que os IDs são Inteiros
        const senderIdInt = parseInt(senderId);
        const receiverIdInt = parseInt(receiverId);
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
                participants: [senderIdInt, receiverIdInt]
            });
        }

        // Criar nova mensagem
        const newMessage = await Message.create({
            senderId: senderIdInt,
            recipientId: receiverIdInt,
            text: message
        });

        // Adicionar a nova mensagem à conversa
        conversation.messages.push(newMessage.id); // Use "id" em vez de "_id"

        // Salvar a conversa
        await conversation.save();

        // Implementar a função do Socket.IO para enviar a mensagem
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error); // Log detalhado do erro
        next(error);
    }
};
