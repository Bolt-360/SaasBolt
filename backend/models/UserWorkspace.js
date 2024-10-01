import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class UserWorkspace extends Model {
        static associate(models) {
            // Associações com User e Workspace
            UserWorkspace.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user'
            });
            UserWorkspace.belongsTo(models.Workspace, {
                foreignKey: 'workspaceId',
                as: 'workspace'
            });
        }
    }

    UserWorkspace.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Users', // O nome da tabela referenciada
                key: 'id'
            }
        },
        workspaceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Workspaces', // O nome da tabela referenciada
                key: 'id'
            }
        },
        role: {
            type: DataTypes.ENUM('owner', 'admin', 'member'),
            allowNull: false,
            defaultValue: 'member'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        lastAccessed: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'UserWorkspace', // Nome do modelo
        tableName: 'UserWorkspaces', // Nome da tabela no banco de dados
        timestamps: true, // Adiciona createdAt e updatedAt
        indexes: [
            {
                unique: true,
                fields: ['userId', 'workspaceId']
            }
        ]
    });

    return UserWorkspace;
};
