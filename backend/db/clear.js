// Substitua 'require' por 'import'
import 'dotenv/config'; // Carregar variáveis de ambiente do arquivo .env
import pkg from 'pg'; // Importando o pacote 'pg'
const { Client } = pkg;

// Configurações do banco de dados usando as variáveis do .env
const client = new Client({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT || 5432,  // Porta padrão do PostgreSQL
});

// Função para limpar as tabelas
const clearTables = async () => {
  try {
    // Conectando ao banco de dados
    await client.connect();
    console.log('Conectado ao banco de dados!');

    // Desabilitar temporariamente as restrições de chave estrangeira
    await client.query('SET session_replication_role = replica;');

    // Limpar as tabelas
    await client.query('TRUNCATE TABLE "Messages" CASCADE;');
    await client.query('TRUNCATE TABLE "Users" CASCADE;');

    // Habilitar novamente as restrições de chave estrangeira
    await client.query('SET session_replication_role = DEFAULT;');

    console.log('Tabelas zeradas com sucesso!');
  } catch (error) {
    console.error('Erro ao limpar as tabelas:', error);
  } finally {
    // Fechar a conexão com o banco de dados
    await client.end();
  }
};

// Executar a função
clearTables();
