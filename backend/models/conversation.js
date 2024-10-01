import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Conversation = sequelize.define('Conversation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    participants: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // ou STRING, dependendo do seu uso
        allowNull: false,
    },
    messages: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // ou STRING, dependendo do seu uso
        allowNull: false,
        defaultValue: [], // Certifique-se de definir um valor padrão
    },
}, {
    tableName: 'conversations',
    timestamps: true,
});

export default Conversation;
