import models from '../models/index.js';
import { io } from '../socket/socket.js';    
const { Campaign, MessageHistory } = models;
import { getCsvContent } from '../utils/getCsvContent.js';
import { sendWhatsAppMessage } from './sendWhatsAppMessage.js';
import { checkImmediateCampaigns } from './checkImmediateCampaigns.js';
import { processCsvContent } from '../controllers/processCsvContent.js';

// Função para iniciar a campanha
const startCampaign = async (campaignId) => {
    let campaign;
    let successCount = 0;
    let failureCount = 0;
    let startTime = Date.now();
    let contacts = [];
    let totalMessages = 0;

    try {
        campaign = await Campaign.findByPk(campaignId);
        if (!campaign) throw new Error('Campanha não encontrada');

        // Atualizar status para PROCESSING e emitir evento
        await campaign.update({ status: 'PROCESSING' });
        console.log('\x1b[35m%s\x1b[0m', `[SOCKET EMIT] campaignStatusChanged:`, {
            campaignId: campaign.id,
            previousStatus: 'PENDING',
            newStatus: 'PROCESSING'
        });
        io.to(`workspace_${campaign.workspaceId}`).emit('campaignStatusChanged', {
            campaignId: campaign.id,
            previousStatus: 'PENDING',
            newStatus: 'PROCESSING',
            timestamp: new Date()
        });

        // Log e emissão do início da campanha
        console.log('\x1b[34m%s\x1b[0m', `[SOCKET EMIT] campaignStarted:`, {
            campaignId: campaign.id,
            name: campaign.name,
            workspaceId: campaign.workspaceId
        });
        
        // Buscar e processar o CSV
        const csvContent = await getCsvContent(campaign.csvFileUrl);
        contacts = await processCsvContent(csvContent);
        
        const messages = Array.isArray(campaign.messages) 
            ? campaign.messages 
            : JSON.parse(campaign.messages);

        totalMessages = contacts.length * messages.length;

        io.to(`workspace_${campaign.workspaceId}`).emit('campaignStarted', {
            campaignId: campaign.id,
            name: campaign.name,
            startTime: new Date(),
            totalContacts: contacts.length,
            totalMessages
        });

        // Durante o processamento
        for (const contact of contacts) {
            for (const messageObj of messages) {
                let processedMessage = messageObj.content; // Inicializa com o conteúdo original
                
                try {
                    // Processa a mensagem substituindo variáveis
                    processedMessage = processMessageVariables(messageObj.content, contact);
                    
                    await sendWhatsAppMessage(
                        campaign.workspaceId,
                        campaign.instanceIds[0],
                        contact,
                        [messageObj]
                    );

                    // Registrar envio bem-sucedido
                    await MessageHistory.create({
                        campaignId: campaign.id,
                        contact: contact.phone,
                        message: processedMessage,
                        status: 'SENT',
                        sentAt: new Date(),
                        metadata: {
                            contactName: contact.name,
                            messageType: 'text',
                            variables: contact
                        }
                    });

                    successCount++;
                    
                    console.log('\x1b[32m%s\x1b[0m', `[SOCKET EMIT] messageSent:`, {
                        campaignId: campaign.id,
                        contact: contact.phone,
                        status: 'SENT'
                    });
                    
                    io.to(`workspace_${campaign.workspaceId}`).emit('messageSent', {
                        campaignId: campaign.id,
                        contact: contact.phone,
                        message: processedMessage,
                        sentAt: new Date(),
                        status: 'SENT'
                    });

                } catch (error) {
                    // Registrar falha no envio
                    await MessageHistory.create({
                        campaignId: campaign.id,
                        contact: contact.phone,
                        message: processedMessage, // Usa a mensagem processada ou original
                        status: 'ERROR',
                        error: error.message,
                        sentAt: new Date(),
                        metadata: {
                            contactName: contact.name,
                            messageType: 'text',
                            variables: contact,
                            errorDetails: error.stack
                        }
                    });

                    failureCount++;
                    
                    console.log('\x1b[31m%s\x1b[0m', `[SOCKET EMIT] messageError:`, {
                        campaignId: campaign.id,
                        contact: contact.phone,
                        error: error.message
                    });
                    
                    io.to(`workspace_${campaign.workspaceId}`).emit('messageError', {
                        campaignId: campaign.id,
                        contact: contact.phone,
                        message: processedMessage,
                        error: error.message,
                        sentAt: new Date()
                    });
                }

                // Log e emissão do progresso
                emitProgress(campaign, successCount, failureCount, totalMessages);
            }
        }

        // Log e emissão da conclusão
        console.log('\x1b[34m%s\x1b[0m', `[SOCKET EMIT] campaignCompleted:`, {
            campaignId: campaign.id,
            status: 'COMPLETED',
            stats: { totalMessages, successCount, failureCount }
        });
        io.to(`workspace_${campaign.workspaceId}`).emit('campaignCompleted', {
            campaignId: campaign.id,
            status: 'COMPLETED',
            stats: {
                totalMessages,
                successCount,
                failureCount,
                completedAt: new Date()
            }
        });

        // Ao finalizar com sucesso
        await campaign.update({ 
            status: 'COMPLETED',
            successCount,
            failureCount,
            lastProcessedAt: new Date()
        });
        console.log('\x1b[35m%s\x1b[0m', `[SOCKET EMIT] campaignStatusChanged:`, {
            campaignId: campaign.id,
            previousStatus: 'PROCESSING',
            newStatus: 'COMPLETED'
        });
        io.to(`workspace_${campaign.workspaceId}`).emit('campaignStatusChanged', {
            campaignId: campaign.id,
            previousStatus: 'PROCESSING',
            newStatus: 'COMPLETED',
            timestamp: new Date(),
            stats: {
                successCount,
                failureCount,
                totalMessages
            }
        });

    } catch (error) {
        console.error('Erro detalhado na campanha:', {
            campaignId,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
};

// Função auxiliar para emitir progresso
const emitProgress = (campaign, successCount, failureCount, totalMessages) => {
    const totalProcessed = successCount + failureCount;
    const percentage = (totalProcessed / totalMessages) * 100;
    
    // Log do progresso
    console.log('\x1b[36m%s\x1b[0m', `[SOCKET EMIT] campaignProgress:`, {
        campaignId: campaign.id,
        progress: `${percentage.toFixed(2)}%`,
        stats: { sent: successCount, failed: failureCount }
    });
    
    io.to(`workspace_${campaign.workspaceId}`).emit('campaignProgress', {
        campaignId: campaign.id,
        status: campaign.status,
        progress: {
            percentage: Math.min(percentage, 100),
            currentCount: totalProcessed,
            totalMessages
        },
        stats: {
            sent: successCount,
            failed: failureCount
        }
    });
};

// Verificação periódica com debounce simples
let timeoutId = null;
const debouncedCheck = () => {
    if (timeoutId) {
        clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(checkImmediateCampaigns, 5000);
};

// Agendar verificação a cada 5 segundos
setInterval(async () => {
    try {
        const hasPending = await Campaign.count({
            where: {
                status: 'PENDING',
                startImmediately: true
            }
        });

        if (hasPending > 0) {
            debouncedCheck();
        }
    } catch (error) {
        console.error('Erro ao verificar campanhas pendentes:', error);
    }
}, 5000);


/**
 * Updates campaign status
 * @param {string} campaignId - Campaign ID
 * @param {string} status - New status
 * @param {Error} error - Error object (optional)
 */

const updateCampaignStatus = async (campaignId, status, error = null) => {
    try {
        const campaign = await Campaign.findByPk(campaignId);
        if (campaign) {
            await campaign.update({ 
                status,
                error: error?.message || null 
            });
            
            io.to(`workspace_${campaign.workspaceId}`).emit('campaignStatusUpdated', {
                campaignId,
                status,
                error: error?.message || null
            });
        }
    } catch (error) {
        console.error('Error updating campaign status:', error);
    }
};

const emitCampaignStatusChange = (campaign, newStatus) => {
    io.to(`workspace_${campaign.workspaceId}`).emit('campaignStatusChanged', {
        campaignId: campaign.id,
        previousStatus: campaign.status,
        newStatus: newStatus,
        timestamp: new Date(),
        stats: {
            successCount: campaign.successCount,
            failureCount: campaign.failureCount
        }
    });
};

// Função auxiliar para processar variáveis na mensagem
const processMessageVariables = (message, contact) => {
    let processedMessage = message;
    
    // Substitui variáveis básicas
    processedMessage = processedMessage
        .replace(/\{nome\}/g, contact.name || '')
        .replace(/\{telefone\}/g, contact.phone || '');
    
    // Se houver outras variáveis no metadata do contato
    if (contact.variables) {
        Object.entries(contact.variables).forEach(([key, value]) => {
            processedMessage = processedMessage.replace(
                new RegExp(`\\{${key}\\}`, 'g'), 
                value || ''
            );
        });
    }
    
    return processedMessage;
};

export {
    startCampaign,
    checkImmediateCampaigns,
    debouncedCheck,
    updateCampaignStatus,
    emitCampaignStatusChange
};