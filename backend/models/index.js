import User from './user.js';
import Message from './message.js';
import Conversation from './conversation.js';
import ConversationParticipants from './conversationParticipants.js';
import Workspace from './workspace.js';
// Adicione outros modelos conforme necessário

const models = {
    User,
    Message,
    Conversation,
    ConversationParticipants,
    Message: Message,
    Workspace: Workspace,
    // Adicione outros modelos aqui
};

// Associar modelos
Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

export default models;
