import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Conversation = sequelize.define('Conversation', {
        participants: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false
        },
        // outros campos...
    });

    Conversation.associate = (models) => {
        Conversation.belongsToMany(models.User, {
            through: 'ConversationParticipants',
            as: 'participantUsers',
            foreignKey: 'conversationId'
        });

        Conversation.hasMany(models.Message, {
            foreignKey: 'conversationId',
            as: 'messages'
        });
    };

    return Conversation;
};