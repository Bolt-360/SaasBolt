import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_URI || 'postgresql://postgres:bolt360BchatDB2024@postgres:5432/campanhas360?schema=public', {
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('📊 Conexão com o banco estabelecida com sucesso!');
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco:', error);
        return false;
    }
};

export default sequelize; 