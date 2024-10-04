import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

import UserModel from './user.js';
import MessageModel from './message.js';
import ConversationModel from './conversation.js';
import ConversationParticipantsModel from './conversationParticipants.js';
import WorkspaceModel from './workspace.js';
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
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

export { sequelize };
export default models;
