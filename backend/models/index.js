import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';
import UserModel from './user.js';
import MessageModel from './message.js';
import ConversationModel from './conversation.js';
import ConversationParticipantsModel from './conversationParticipants.js';
import WorkspaceModel from './workspace.js';
<<<<<<< Updated upstream
import UserWorkspaceModel from './UserWorkspace.js';
import PasswordResetToken from './passwordResetToken.js';
    
const User = UserModel(sequelize, Sequelize.DataTypes);
const Message = MessageModel(sequelize, Sequelize.DataTypes);
const Conversation = ConversationModel(sequelize, Sequelize.DataTypes);
const ConversationParticipants = ConversationParticipantsModel(sequelize, Sequelize.DataTypes);
const Workspace = WorkspaceModel(sequelize, Sequelize.DataTypes);
const UserWorkspace = UserWorkspaceModel(sequelize, Sequelize.DataTypes);
const PwdReset = PasswordResetToken(sequelize, Sequelize.DataTypes) 

const models = {
    User,
    Message,
    Conversation,
    ConversationParticipants,
    Workspace,
    UserWorkspace,
    PwdReset
=======
import UserWorkspaceModel from './userWorkspace.js';
import WorkspaceModuleModel from './workspaceModule.js';
import InstanceModel from './instance.js';
import CampaignModel from './campaign.js';
import MessageCampaignModel from './messageCampaign.js';
import RecipientModel from './recipient.js';
import MessageHistoryModel from './messageHistory.js';
import passwordResetToken from './passwordResetToken.js';

const PwdReset = passwordResetToken(sequelize, Sequelize.DataTypes);

const models = {
  User: UserModel(sequelize),
  Message: MessageModel(sequelize),
  Conversation: ConversationModel(sequelize),
  ConversationParticipants: ConversationParticipantsModel(sequelize),
  Workspace: WorkspaceModel(sequelize),
  UserWorkspace: UserWorkspaceModel(sequelize),
  WorkspaceModule: WorkspaceModuleModel(sequelize),
  Instance: InstanceModel(sequelize),
  Campaign: CampaignModel(sequelize),
  MessageCampaign: MessageCampaignModel(sequelize),
  Recipient: RecipientModel(sequelize),
  MessageHistory: MessageHistoryModel(sequelize),
  PwdReset,
>>>>>>> Stashed changes
};

// Associar modelos
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

// Sincronizar com o banco de dados
sequelize.sync({ alter: true }) // Usar 'alter' para evitar perda de dados
  .then(() => {
    console.log('Sincronização com o banco de dados concluída');
  })
  .catch((error) => {
    console.error('Erro ao sincronizar com o banco de dados:', error);
  });

export { sequelize };
export default models;
