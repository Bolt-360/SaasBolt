import { Op } from 'sequelize';
import models from '../models/index.js';
const { User, Conversation, Message } = models;

export const getUserConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('Requisição recebida para getUserConversations');
        console.log('User ID:', userId);

        const conversations = await Conversation.findAll({
            include: [
                {
                    model: User,
                    as: 'participantUsers', // Usamos o mesmo alias definido no modelo
                    attributes: ['id', 'username', 'profilePicture'],
                    through: { attributes: [] }
                },
                {
                    model: Message,
                    as: 'messages',
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    include: [
                        {
                            model: User,
                            as: 'sender',
                            attributes: ['id', 'username']
                        }
                    ]
                }
            ],
            where: {
                participants: {
                    [Op.contains]: [userId]
                }
            }
        });

        res.json(conversations);
    } catch (error) {
        console.error('Erro detalhado:', error);
        res.status(500).json({ message: 'Erro ao buscar conversas', error: error.message });
    }
};
