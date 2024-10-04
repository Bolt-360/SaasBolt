import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.PwdReset, {
                foreignKey: 'userId',
                as: 'pwdResetToken'
            });

            User.hasMany(models.Message, {
                foreignKey: 'senderId',
                as: 'sentMessages'
            });

            User.hasMany(models.Message, {
                foreignKey: 'recipientId',
                as: 'receivedMessages'
            });

            User.belongsToMany(models.Conversation, {
                through: models.ConversationParticipants,
                foreignKey: 'userId',
                otherKey: 'conversationId',
                as: 'participatedConversations'
            });

            User.belongsToMany(models.Workspace, {
                through: models.UserWorkspace,
                foreignKey: 'userId',
                otherKey: 'workspaceId',
                as: 'participatedWorkspaces'
            })
        }
    }

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cpf: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        profilePicture: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        gender: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['Masculino', 'Feminino']],
            },
        },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        timestamps: true,
    });

    return User;
};