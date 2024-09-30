// models/conversationParticipants.js
import sequelize from '../config/database.js'; 
import { DataTypes } from 'sequelize';

const ConversationParticipants = sequelize.define('ConversationParticipants', {
    conversationId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Conversations',
            key: 'id',
        },
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id',
        },
        primaryKey: true,
    },
});

export default ConversationParticipants;
