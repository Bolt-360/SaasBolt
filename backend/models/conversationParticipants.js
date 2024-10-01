import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class ConversationParticipants extends Model {
        static associate(models) {
            // Não são necessárias associações aqui, pois esta é uma tabela de junção
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