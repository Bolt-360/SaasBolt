import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

const sequelize = new Sequelize(
    process.env.POSTGRES_DB || 'campanhas360',
    process.env.POSTGRES_USER || 'bolt360ti',
    process.env.POSTGRES_PASSWORD || 'kasdjasidaau1n213mmaaasdncksk',
    {
        host: isDevelopment ? 'localhost' : process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT || 4001,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

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