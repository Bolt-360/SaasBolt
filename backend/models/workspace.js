import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class Workspace extends Model {
        static associate(models) {
            Workspace.belongsToMany(models.User, {
                through: 'UserWorkspaces',
                foreignKey: 'workspaceId',
                otherKey: 'userId'
            });
        }
    }

    Workspace.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cnpj: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
        // Outros campos relevantes para o Workspace
    }, {
        sequelize,
        modelName: 'Workspace',
        tableName: 'Workspaces',
        timestamps: true,
    });

    return Workspace;
};