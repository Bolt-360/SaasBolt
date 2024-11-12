import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ 
    path: path.resolve(__dirname, '..', '.env.local') 
});

const isDevelopment = process.env.NODE_ENV !== 'production';

// Lista de todas as tabelas necessárias
const REQUIRED_TABLES = [
    'Users',
    'Workspaces',
    'UserWorkspaces',
    'Campaigns',
    'MessageHistories',
    'Instances',
    'Recipients',
    'MessageCampaigns',
    'Conversations',
    'Messages',
    'ConversationParticipants',
    'WorkspaceModules',
    'PasswordResetTokens'
];

const dbConfig = {
    database: 'campanhas360',
    username: process.env.POSTGRES_USER || 'bolt360ti',
    password: process.env.POSTGRES_PASSWORD || 'kasdjasidaau1n213mmaaasdncksk',
    host: isDevelopment ? 'localhost' : process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '4001')
};

console.log('📊 Configurações do banco:', {
    ...dbConfig,
    password: '****'
});

async function createDatabaseIfNotExists() {
    const { Pool } = pg;
    const pool = new Pool({
        user: dbConfig.username,
        host: dbConfig.host,
        port: dbConfig.port,
        password: dbConfig.password,
        database: 'postgres'
    });

    try {
        console.log('🔄 Conectando ao PostgreSQL...');
        await pool.connect();

        const result = await pool.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [dbConfig.database]
        );

        if (result.rows.length === 0) {
            console.log(`📝 Criando banco de dados ${dbConfig.database}...`);
            await pool.query(`CREATE DATABASE ${dbConfig.database}`);
            console.log('✅ Banco de dados criado com sucesso!');
            return true;
        } else {
            console.log('✅ Banco de dados já existe.');
            return false;
        }
    } catch (error) {
        console.error('❌ Erro ao criar/verificar banco de dados:', error);
        throw error;
    } finally {
        await pool.end();
    }
}

// Adiciona um timeout para as operações
const OPERATION_TIMEOUT = 10000; // 10 segundos

// Função auxiliar para adicionar timeout
function withTimeout(promise, timeoutMs, operationName) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Timeout: Operação ${operationName} excedeu ${timeoutMs}ms`));
            }, timeoutMs);
        })
    ]);
}

async function checkExistingTables() {
    console.log('\nIniciando verificação de tabelas...');
    
    const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: 'postgres',
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        dialectOptions: {
            connectTimeout: 5000 // 5 segundos timeout na conexão
        }
    });

    try {
        await withTimeout(
            sequelize.authenticate(),
            OPERATION_TIMEOUT,
            'autenticação'
        );
        console.log('✅ Conexão estabelecida para verificar tabelas');

        const queryInterface = sequelize.getQueryInterface();
        const existingTables = await withTimeout(
            queryInterface.showAllTables(),
            OPERATION_TIMEOUT,
            'listagem de tabelas'
        );
        
        console.log('\n📋 Tabelas existentes:', existingTables);
        
        const missingTables = REQUIRED_TABLES.filter(table => !existingTables.includes(table));
        
        if (missingTables.length > 0) {
            console.log('\n⚠️ Tabelas faltantes:', missingTables);
        } else {
            console.log('\n✅ Todas as tabelas necessárias já existem');
        }

        return { existingTables, missingTables };
    } catch (error) {
        console.error('❌ Erro ao verificar tabelas:', error);
        throw error;
    } finally {
        try {
            await sequelize.close();
        } catch (closeError) {
            console.error('Erro ao fechar conexão:', closeError);
        }
    }
}

async function createMissingTables(missingTables) {
    if (missingTables.length === 0) {
        console.log('✅ Nenhuma tabela precisa ser criada');
        return;
    }

    const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: 'postgres',
        logging: false
    });

    try {
        console.log('\n📝 Criando tabelas faltantes...');
        
        // Importa os modelos
        const models = await import('../models/index.js');
        
        // Sincroniza apenas as tabelas que faltam
        await sequelize.sync({ 
            force: false,
            alter: true
        });

        console.log('✅ Tabelas criadas com sucesso!');

        // Verifica o resultado final
        const queryInterface = sequelize.getQueryInterface();
        const finalTables = await queryInterface.showAllTables();
        console.log('\n📋 Tabelas finais:', finalTables);

    } catch (error) {
        console.error('❌ Erro ao criar tabelas:', error);
        throw error;
    } finally {
        await sequelize.close();
    }
}

async function init() {
    const timeoutId = setTimeout(() => {
        console.error('Script excedeu o tempo máximo de execução (30s)');
        process.exit(1);
    }, 30000); // 30 segundos timeout global

    try {
        console.log('🚀 Iniciando processo de inicialização do banco...\n');
        
        // Etapa 1: Verifica/cria o banco
        console.log('Etapa 1: Verificando banco de dados...');
        const created = await createDatabaseIfNotExists();
        console.log('Etapa 1 concluída ✅');
        
        // Etapa 2: Verifica tabelas
        console.log('\nEtapa 2: Verificando tabelas existentes...');
        const { missingTables } = await checkExistingTables();
        console.log('Etapa 2 concluída ✅');
        
        // Etapa 3: Cria tabelas faltantes
        if (missingTables.length > 0) {
            console.log('\nEtapa 3: Criando tabelas faltantes...');
            await createMissingTables(missingTables);
            console.log('Etapa 3 concluída ✅');
        } else {
            console.log('\nEtapa 3: Nenhuma tabela precisa ser criada ✅');
        }
        
        clearTimeout(timeoutId);
        console.log('\n✨ Processo de inicialização concluído com sucesso!');
        process.exit(0);
    } catch (error) {
        clearTimeout(timeoutId);
        console.error('\n❌ Erro fatal na inicialização:', error);
        if (error.original) {
            console.error('Erro original:', error.original);
        }
        process.exit(1);
    }
}

// Executa a inicialização com tratamento de erros
console.log('Iniciando script...');
init().catch(error => {
    console.error('Erro ao executar init:', error);
    process.exit(1);
});
