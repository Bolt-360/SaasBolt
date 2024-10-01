import { sequelize } from '../models/index.js';
import models from '../models/index.js';

async function initDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o banco de dados estabelecida com sucesso.');

        // Sincronize os modelos com o banco de dados
        await sequelize.sync({ force: true }); // Use { force: true } com cuidado, pois isso recriará as tabelas
        console.log('Modelos sincronizados com o banco de dados.');

    } catch (error) {
        console.error('Não foi possível conectar ao banco de dados:', error);
    } finally {
        await sequelize.close();
    }
}

initDatabase();
