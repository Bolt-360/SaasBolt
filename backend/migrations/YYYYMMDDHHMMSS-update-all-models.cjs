'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criar tabela Users
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      profilePicture: {
        type: Sequelize.STRING,
        defaultValue: '',
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      activeWorkspaceId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Workspaces',
          key: 'id',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Criar tabela Workspaces
    await queryInterface.createTable('Workspaces', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      activeModules: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: ['chat', 'kanban'],
        allowNull: false,
      },
      inviteCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Criar tabela Campaigns
    await queryInterface.createTable('Campaigns', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Workspaces',
          key: 'id',
        },
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      startImmediately: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      startDate: {
        type: Sequelize.DATE,
      },
      messageInterval: {
        type: Sequelize.INTEGER,
      },
      messages: {
        type: Sequelize.JSONB,
      },
      instanceIds: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      csvFileUrl: {
        type: Sequelize.STRING,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'PENDING',
      },
      successCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      failureCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      error: {
        type: Sequelize.TEXT,
      },
      lastProcessedAt: {
        type: Sequelize.DATE,
      },
      instanceId: {
        type: Sequelize.STRING,
      },
      scheduledTo: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Criar tabela MessageHistories
    await queryInterface.createTable('MessageHistories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      campaignId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Campaigns',
          key: 'id',
        },
      },
      contact: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('SENT', 'ERROR'),
        allowNull: false,
      },
      error: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sentAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Criar tabela MessageLogs
    await queryInterface.createTable('MessageLogs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      messageCampaignId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'MessageCampaigns',
          key: 'id',
        },
      },
      recipientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Recipients',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.ENUM('SENT', 'DELIVERED', 'READ', 'FAILED'),
        allowNull: false,
        defaultValue: 'SENT',
      },
      sentAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deliveredAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      readAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Criar tabela Instances
    await queryInterface.createTable('Instances', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM('CONNECTED', 'DISCONNECTED', 'WAITING_QR', 'CONNECTING'),
        allowNull: false,
        defaultValue: 'DISCONNECTED',
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Workspaces',
          key: 'id',
        },
      },
      qrcode: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      frontName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Criar tabela Conversations
    await queryInterface.createTable('Conversations', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      workspaceId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Workspaces',
          key: 'id',
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isGroup: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lastMessageAt: {
        type: Sequelize.DATE,
      },
      groupProfilePhoto: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Criar tabela ConversationParticipants
    await queryInterface.createTable('ConversationParticipants', {
      conversationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Conversations',
          key: 'id',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remover tabelas na ordem inversa
    await queryInterface.dropTable('ConversationParticipants');
    await queryInterface.dropTable('Conversations');
    await queryInterface.dropTable('Instances');
    await queryInterface.dropTable('MessageLogs');
    await queryInterface.dropTable('MessageHistories');
    await queryInterface.dropTable('Campaigns');
    await queryInterface.dropTable('Workspaces');
    await queryInterface.dropTable('Users');
  },
};