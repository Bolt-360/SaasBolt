import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Workspace = sequelize.define('Workspace', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    cnpj:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
    // Outros campos relevantes para o Workspace
});

export default Workspace;
