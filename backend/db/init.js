import sequelize from '../config/database.js'; // ajuste o caminho conforme necessário

const initDatabase = async () => {
    try {
        await sequelize.sync({ force: true }); // force: true recria as tabelas
        console.log("Tabelas criadas com sucesso!");
    } catch (error) {
        console.error("Erro ao criar as tabelas:", error);
    } finally {
        await sequelize.close();
    }
};

initDatabase();
