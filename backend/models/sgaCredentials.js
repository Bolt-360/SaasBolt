import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class SgaCredentials extends Model {
        static associate(models) {
            SgaCredentials.belongsTo(models.Workspace, {
                foreignKey: 'workspaceId',
                as: 'workspace'
            });
        }
    }

    SgaCredentials.init({
        workspaceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Workspaces',
                key: 'id'
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        login: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        auth_token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        vencimentos: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        firstDay: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'SgaCredentials',
        tableName: 'SgaCredentials',
        timestamps: true
    });

    return SgaCredentials;
}