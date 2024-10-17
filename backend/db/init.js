import sequelize from '../config/database.js';
import models from '../models/index.js';
import bcryptjs from 'bcryptjs';

const { User, Workspace, UserWorkspace, Conversation, Message, Instance, Campaign, MessageCampaign } = models;

// Função para gerar um código de convite único
const generateUniqueInviteCode = async () => {
    let inviteCode;
    let isUnique = false;
    
    while (!isUnique) {
        // Gera um código aleatório de 5 dígitos
        inviteCode = Math.floor(10000 + Math.random() * 90000).toString();
        
        // Verifica se o código já existe
        const existingWorkspace = await Workspace.findOne({ where: { inviteCode } });
        if (!existingWorkspace) {
            isUnique = true;
        }
    }
    
    return inviteCode;
};

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

async function createInitialWorkspaces() {
  try {
    const workspaces = [
      { name: 'Pensar Clube', cnpj: '12345678901234' },
      { name: 'Bolt Tecnologia', cnpj: '56789012345678' }
    ];

    for (const workspaceData of workspaces) {
      const inviteCode = await generateUniqueInviteCode();
      await Workspace.create({
        ...workspaceData,
        inviteCode
      });
    }

    console.log('Workspaces iniciais criados com sucesso.');
  } catch (error) {
    console.error('Erro ao criar workspaces iniciais:', error);
  }
}

async function associateUsersToWorkspaces() {
  const { User, Workspace, UserWorkspace } = models;
  const users = await User.findAll();
  const workspaces = await Workspace.findAll();

  if (users.length === 0 || workspaces.length === 0) {
    console.log('Não há usuários ou workspaces para associar.');
    return;
  }

  for (let i = 0; i < users.length; i++) {
    if (i === 0) {
      // User 0 é associado a ambos os workspaces
      for (const workspace of workspaces) {
        try {
          await UserWorkspace.create({
            userId: users[i].id,
            workspaceId: workspace.id,
            role: 'owner'
          });
          console.log(`User 0 (${users[i].username}) associado ao workspace ${workspace.name}`);
        } catch (error) {
          console.error(`Erro ao associar User 0 (${users[i].username}) ao workspace ${workspace.name}:`, error);
        }
      }
      // Definir o primeiro workspace como ativo para User 0
      await users[i].update({ activeWorkspaceId: workspaces[0].id });
    } else {
      // Para os outros usuários, manter a lógica original
      const workspaceIndex = i < 5 ? 0 : 1;
      if (workspaces[workspaceIndex]) {
        try {
          await UserWorkspace.create({
            userId: users[i].id,
            workspaceId: workspaces[workspaceIndex].id,
            role: i % 5 === 0 ? 'owner' : 'member'
          });
          
          // Atualizar o activeWorkspaceId do usuário
          await users[i].update({ activeWorkspaceId: workspaces[workspaceIndex].id });
          
          console.log(`Usuário ${users[i].username} associado ao workspace ${workspaces[workspaceIndex].name}`);
        } catch (error) {
          console.error(`Erro ao associar usuário ${users[i].username} ao workspace:`, error);
        }
      } else {
        console.log(`Workspace não encontrado para o índice ${workspaceIndex}`);
      }
    }
  }

  console.log('Processo de associação de usuários aos workspaces concluído.');
}

async function createInitialConversations() {
  const { User, Conversation, Message, Workspace } = models;
  const workspaces = await Workspace.findAll();

  for (const workspace of workspaces) {
    const workspaceUsers = await User.findAll({
      where: { activeWorkspaceId: workspace.id }
    });
    
    if (workspaceUsers.length < 2) {
      console.log(`Workspace ${workspace.name} não tem usuários suficientes para criar conversas.`);
      continue;
    }

    const user0 = await User.findByPk(1); // User 0 com ID 1

    for (let j = 0; j < 5; j++) {
      try {
        // Seleciona 2 a 4 usuários aleatórios para a conversa, sempre incluindo User 0
        const participantCount = Math.floor(Math.random() * 3) + 2; // 2 a 4 participantes
        const otherParticipants = workspaceUsers
          .filter(user => user.id !== 1)
          .sort(() => 0.5 - Math.random())
          .slice(0, participantCount - 1);
        
        const participants = [user0, ...otherParticipants];
        
        const isGroup = participantCount > 2;
        const conversationName = isGroup 
          ? `Grupo ${j + 1} - ${workspace.name}`
          : `Conversa ${j + 1} - ${workspace.name}`;

        const conversation = await Conversation.create({
          workspaceId: workspace.id,
          name: conversationName,
          isGroup: isGroup,
          groupProfilePhoto: isGroup ? 'https://cdn.icon-icons.com/icons2/2428/PNG/512/whatsapp_black_logo_icon_147050.png' : null
        });

        await conversation.setParticipants(participants);

        // Gera entre 5 e 15 mensagens para a conversa
        const messageCount = Math.floor(Math.random() * 11) + 5;
        
        for (let k = 0; k < messageCount; k++) {
          const sender = participants[Math.floor(Math.random() * participants.length)];
          
          await Message.create({
            conversationId: conversation.id,
            senderId: sender.id,
            content: `Mensagem ${k + 1} de ${sender.username} na ${isGroup ? 'grupo' : 'conversa'} ${conversationName}`
          });
        }

        // Atualiza o lastMessageAt da conversa
        await conversation.update({ lastMessageAt: new Date() });

        console.log(`${isGroup ? 'Grupo' : 'Conversa'} ${j + 1} criado para o workspace ${workspace.name} com ${messageCount} mensagens e ${participantCount} participantes (incluindo User 0)`);
      } catch (error) {
        console.error(`Erro ao criar conversa para o workspace ${workspace.name}:`, error);
      }
    }
  }

  console.log('Conversas e mensagens iniciais criadas com sucesso.');
}

async function createInitialInstances() {
  const workspaces = await Workspace.findAll();
  for (const workspace of workspaces) {
    const instanceId = `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await Instance.create({
      id: instanceId,
      name: `Instância de Teste ${instanceId}`,
      workspaceId: workspace.id,
      status: 'DISCONNECTED'
    });
  }
}

async function createInitialCampaigns() {
  const workspaces = await Workspace.findAll();
  const instances = await Instance.findAll();

  for (const workspace of workspaces) {
    const instance = instances.find(i => i.workspaceId === workspace.id);
    if (instance) {
      const campaign1 = await Campaign.create({
        name: `Campanha de Boas-vindas ${workspace.name}`,
        type: 'MESSAGE',
        status: 'TO_START',
        startDate: new Date(),
        messageInterval: 60, // 60 segundos
        instanceId: instance.id,
        workspaceId: workspace.id
      });

      await MessageCampaign.create({
        content: 'Olá! Bem-vindo à nossa campanha de boas-vindas.',
        order: 1,
        campaignId: campaign1.id
      });

      const campaign2 = await Campaign.create({
        name: `Campanha Promocional ${workspace.name}`,
        type: 'MESSAGE_IMAGE',
        status: 'TO_START',
        startDate: new Date(Date.now() + 86400000), // Começa amanhã
        messageInterval: 120, // 120 segundos
        instanceId: instance.id,
        workspaceId: workspace.id
      });

      await MessageCampaign.create({
        content: 'Confira nossa promoção especial!',
        order: 1,
        campaignId: campaign2.id
      });

      console.log(`Campanhas de teste criadas para o workspace ${workspace.name}`);
    }
  }
}

async function initDatabase() {
  try {
    await sequelize.sync({ force: true }); // Use force: true apenas uma vez para recriar as tabelas
    console.log('Banco de dados sincronizado com sucesso.');

    if (process.env.PRODUCTION === 'false') {
      await createInitialUsers();
      await createInitialWorkspaces();
      await associateUsersToWorkspaces();
      await createInitialInstances();
      await createInitialConversations();
      await createInitialCampaigns();
    }

    console.log('Inicialização do banco de dados concluída.');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
  } finally {
    await sequelize.close();
  }
}

initDatabase();
