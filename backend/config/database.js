import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV === 'development';

// Configuração explícita para garantir o uso de localhost
// Lembrar de alterar o host para o ambiente de produção: utilizando Docker host deve ser o nome do container
const config = {
    dialect: 'postgres',
    host: 'localhost',
    port: 4001,
    username: 'bolt360ti',
    password: 'kasdjasidaau1n213mmaaasdncksk',
    database: 'campanhas360',
    logging: false, // Desabilitando todos os logs do Sequelize
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};

// Criar instância do Sequelize com a configuração explícita
const sequelize = new Sequelize(config);

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