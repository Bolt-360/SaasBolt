import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class ConversationParticipants extends Model {
        static associate(models) {
            ConversationParticipants.belongsTo(models.Conversation, {
                foreignKey: 'conversationId',
                as: 'conversation'
            });
            ConversationParticipants.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });
        }
    }

    ConversationParticipants.init({
        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Conversations',
                key: 'id'
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'ConversationParticipants',
        tableName: 'ConversationParticipants',
        timestamps: true
    });

    return ConversationParticipants;
};