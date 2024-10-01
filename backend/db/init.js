import sequelize from '../config/database.js';

const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Conexão com o PostgreSQL estabelecida com sucesso.');

        // Sincroniza todos os modelos com o banco de dados
        await sequelize.sync({ alter: true }); // 'alter' atualiza a tabela, mantendo os dados
        console.log('Tabelas sincronizadas com sucesso.');
    } catch (error) {
        console.error('Erro ao conectar ao PostgreSQL:', error);
    } finally {
        await sequelize.close();
    }
};

initDatabase();
