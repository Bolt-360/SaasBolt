import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // ajuste o caminho conforme necessário

const User = sequelize.define('User', {
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
        enum: ['Masculino', 'Feminino'],
    },
}, {
    tableName: 'users',
    timestamps: true,
});

export default User;
