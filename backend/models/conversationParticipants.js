import sequelize from '../config/database.js'; 
import { DataTypes } from 'sequelize';

const ConversationParticipants = sequelize.define('ConversationParticipants', {
    conversationId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Conversations',  // Certifique-se de que o nome da tabela está correto
            key: 'id',
        },
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',  // Corrigido para corresponder ao nome da tabela 'users'
            key: 'id',
        },
        primaryKey: true,
    },
});

export default ConversationParticipants;
