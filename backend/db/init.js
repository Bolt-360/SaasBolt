import sequelize from '../config/database.js';
import models from '../models/index.js';
import bcryptjs from 'bcryptjs';

async function createInitialUsers() {
    const { User } = models;
    const users = [
        { username: 'User 0', email: 'usuario@teste.com.br', password: '123', cpf: '12345678901', gender: 'Masculino' },
        { username: 'User 1', email: 'usuario1@teste.com.br', password: '123', cpf: '23456789012', gender: 'Feminino' },
        { username: 'User 2', email: 'usuario2@teste.com.br', password: '123', cpf: '34567890123', gender: 'Masculino' },
        { username: 'User 3', email: 'usuario3@teste.com.br', password: '123', cpf: '45678901234', gender: 'Feminino' },
        { username: 'User 4', email: 'usuario4@teste.com.br', password: '123', cpf: '56789012345', gender: 'Masculino' },
        { username: 'User 5', email: 'usuario5@teste.com.br', password: '123', cpf: '67890123456', gender: 'Feminino' },
        { username: 'User 6', email: 'usuario6@teste.com.br', password: '123', cpf: '78901234567', gender: 'Masculino' },
        { username: 'User 7', email: 'usuario7@teste.com.br', password: '123', cpf: '89012345678', gender: 'Feminino' },
        { username: 'User 8', email: 'usuario8@teste.com.br', password: '123', cpf: '90123456789', gender: 'Masculino' },
        { username: 'User 9', email: 'usuario9@teste.com.br', password: '123', cpf: '01234567890', gender: 'Feminino' },
    ];

    for (const user of users) {
        const hashedPassword = await bcryptjs.hash(user.password, 10);
        await User.create({
            ...user,
            password: hashedPassword,
            profilePicture: user.gender === 'Masculino'
                ? `https://avatar.iran.liara.run/public/boy?username=${user.username}`
                : `https://avatar.iran.liara.run/public/girl?username=${user.username}`
        });
    }

    console.log('Usuários iniciais criados com sucesso.');
}

async function initDatabase() {
    try {
        // Sincroniza todos os modelos
        await sequelize.sync({ alter: true });
        console.log('Banco de dados sincronizado com sucesso.');

        // Verifica especificamente a tabela UserWorkspaces
        const [results] = await sequelize.query("SELECT * FROM information_schema.columns WHERE table_name = 'UserWorkspaces'");
        console.log('Colunas na tabela UserWorkspaces:', results.map(r => r.column_name));

        // Se alguma coluna estiver faltando, você pode adicioná-la manualmente aqui
        const missingColumns = ['role', 'isActive', 'lastAccessed'].filter(col => !results.find(r => r.column_name === col));
        for (const column of missingColumns) {
            switch (column) {
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

        // Verifica se estamos em ambiente de produção
        if (process.env.PRODUCTION === 'false') {
            // Cria os usuários iniciais
            await createInitialUsers();
        }

        console.log('Inicialização do banco de dados concluída.');
    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
    } finally {
        await sequelize.close();
    }
}

initDatabase();
