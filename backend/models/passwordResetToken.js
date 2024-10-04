import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
    class PasswordResetToken extends Model {
        static associate(models) {
            PasswordResetToken.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
        }
    }

    PasswordResetToken.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'PasswordResetToken',
        tableName: 'PasswordResetTokens',
        timestamps: true,
    });

    return PasswordResetToken;
};