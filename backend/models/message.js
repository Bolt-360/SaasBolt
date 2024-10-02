import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Message extends Model {
        static associate(models) {
            Message.belongsTo(models.User, {
                foreignKey: 'senderId',
                as: 'sender'
            });
            
            Message.belongsTo(models.User, {
                foreignKey: 'recipientId',
                as: 'recipient'
            });

            Message.belongsTo(models.Conversation, {
                foreignKey: 'conversationId',
                as: 'conversation'
            });
        }
    }

    Message.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        recipientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        conversationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'Message',
        tableName: 'Messages',
        timestamps: true,
    });

    return Message;
};