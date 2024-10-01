import sequelize from '../config/database.js';
import models from '../models/index.js';

async function initDatabase() {
  try {
    // Sincroniza todos os modelos
    await sequelize.sync({ alter: true });
    console.log('Banco de dados sincronizado com sucesso.');

    // Verifica especificamente a tabela UserWorkspaces
    const [results, metadata] = await sequelize.query("SELECT * FROM information_schema.columns WHERE table_name = 'UserWorkspaces'");
    console.log('Colunas na tabela UserWorkspaces:', results.map(r => r.column_name));

    // Se alguma coluna estiver faltando, você pode adicioná-la manualmente aqui
    const missingColumns = ['role', 'isActive', 'lastAccessed'].filter(col => !results.find(r => r.column_name === col));
    for (const column of missingColumns) {
      switch(column) {
        case 'role':
          // Cria o tipo ENUM se não existir
          await sequelize.query("DO $$ BEGIN CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member'); EXCEPTION WHEN duplicate_object THEN null; END $$;");
          // Adiciona a coluna usando o tipo ENUM criado
          await sequelize.query("ALTER TABLE \"UserWorkspaces\" ADD COLUMN IF NOT EXISTS role user_role NOT NULL DEFAULT 'member'");
          break;
        case 'isActive':
          await sequelize.query("ALTER TABLE \"UserWorkspaces\" ADD COLUMN IF NOT EXISTS \"isActive\" BOOLEAN NOT NULL DEFAULT true");
          break;
        case 'lastAccessed':
          await sequelize.query("ALTER TABLE \"UserWorkspaces\" ADD COLUMN IF NOT EXISTS \"lastAccessed\" TIMESTAMP");
          break;
      }
      console.log(`Coluna ${column} adicionada à tabela UserWorkspaces.`);
    }

    console.log('Inicialização do banco de dados concluída.');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  } finally {
    await sequelize.close();
  }
}

initDatabase();