import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

import UserModel from './user.js';
import MessageModel from './message.js';
import ConversationModel from './conversation.js';
import ConversationParticipantsModel from './conversationParticipants.js';
import WorkspaceModel from './workspace.js';
import UserWorkspaceModel from './userWorkspace.js';
import WorkspaceModuleModel from './workspaceModule.js';

const User = UserModel(sequelize);
const Message = MessageModel(sequelize);
const Conversation = ConversationModel(sequelize);
const ConversationParticipants = ConversationParticipantsModel(sequelize);
const Workspace = WorkspaceModel(sequelize);
const UserWorkspace = UserWorkspaceModel(sequelize);
const WorkspaceModule = WorkspaceModuleModel(sequelize);

const models = {
    User,
    Message,
    Conversation,
    ConversationParticipants,
    Workspace,
    UserWorkspace,
    WorkspaceModule
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

export { sequelize };
export default models;
