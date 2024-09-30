// models/message.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; 
import User from './user.js'; // Importar o modelo User

const Message = sequelize.define('Message', {
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
        references: {
            model: User,
            key: 'id',
        },
    },
    recipientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
});

// Relacionamento com o usuário remetente
Message.associate = (models) => {
    Message.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender', // Alias para fácil acesso
    });
    
    // Relacionamento com o usuário destinatário
    Message.belongsTo(models.User, {
        foreignKey: 'recipientId',
        as: 'recipient', // Alias para fácil acesso
    });
};

export default Message;
