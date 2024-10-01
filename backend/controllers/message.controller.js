import { Op } from "sequelize";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";

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
                messages: []
            });
        }

        // Criar nova mensagem
        const newMessage = await Message.create({
            senderId: senderIdInt,
            recipientId: receiverIdInt,
            text: message,
            conversationId: conversation.id
        });

        // Verifica se o array de mensagens existe e adiciona a nova mensagem
        if (!conversation.messages) {
            conversation.messages = []; // Iniciar o array se não existir
        }

        // Atualizar o array de mensagens
        const updatedMessages = [...conversation.messages, newMessage.id];
        conversation.setDataValue('messages', updatedMessages);

        // Salvar a conversa com o novo array de mensagens
        await conversation.save();

        // Retornar a nova mensagem criada
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error); // Log do erro
        next(error);
    }
};
