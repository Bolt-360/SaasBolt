import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Conversation extends Model {
        static associate(models) {
            Conversation.hasMany(models.Message, {
                foreignKey: 'conversationId',
                as: 'messages'
            });

            Conversation.belongsToMany(models.User, {
                through: models.ConversationParticipants,
                foreignKey: 'conversationId',
                otherKey: 'userId',
                as: 'participantUsers'
            });
        }
    }

    Conversation.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        participants: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: false,
        },
        messageIds: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: [],
        },
    }, {
        sequelize,
        modelName: 'Conversation',
        tableName: 'Conversations',
        timestamps: true,
    });

    return Conversation;
};