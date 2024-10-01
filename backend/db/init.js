// Carregar variáveis de ambiente do arquivo .env
import 'dotenv/config';
import sequelize from '../config/database.js'; // Importa a instância do sequelize configurada
import models from '../models/index.js'; // Importa todos os modelos

// Função para inicializar o banco de dados
const initDatabase = async () => {
  try {
    // Autenticar a conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');

    // Definir as relações entre os modelos se necessário (associações)
    models.User.hasMany(models.Message, { foreignKey: 'senderId', as: 'sentMessages' });
    models.User.hasMany(models.Message, { foreignKey: 'recipientId', as: 'receivedMessages' });
    models.Message.belongsTo(models.User, { foreignKey: 'senderId', as: 'senderMessage' });
    models.Message.belongsTo(models.User, { foreignKey: 'recipientId', as: 'recipientMessage' });

    models.Conversation.hasMany(models.Message, { foreignKey: 'conversationId' });
    models.Message.belongsTo(models.Conversation, { foreignKey: 'conversationId' });

    models.Conversation.belongsToMany(models.User, { through: models.ConversationParticipants, foreignKey: 'conversationId' });
    models.User.belongsToMany(models.Conversation, { through: models.ConversationParticipants, foreignKey: 'userId' });

    // Sincronizar o modelo com o banco de dados
    await sequelize.sync({ force: true }); // 'force: true' recria as tabelas a cada vez (útil para desenvolvimento)
    console.log('Tabelas sincronizadas com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar ou sincronizar o banco de dados:', error);
  } finally {
    // Fechar a conexão (opcional, geralmente não necessário em um servidor)
    // await sequelize.close();
  }
};

// Executar a função de inicialização
initDatabase();
