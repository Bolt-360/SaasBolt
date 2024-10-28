import models from '../models/index.js';
import { parse } from 'csv-parse/sync';
import axios from 'axios';
import { io } from '../socket/socket.js';
import { Op } from 'sequelize';
import minioClient from '../config/minio.js';
import { EVOLUTION_API_URL, EVOLUTION_API_KEY } from '../config/evolutionapi.cjs';

const { Campaign } = models;

// Função para enviar mensagem via API do WhatsApp
const sendWhatsAppMessage = async (workspaceId, instanceId, number, text, delay = 1000) => {
  console.log(`\nPreparando envio para ${number}`);
  
  try {
    const messagePayload = {
      number,
      text: text.replace(/\n/g, '\\n'),
      delay: delay * 1000, // Converte segundos para milissegundos
      linkPreview: true
    };

    // Converte o instanceId para string e formata o nome da instância
    const instanceName = `${workspaceId}-${String(instanceId)}`;
    
    const apiUrl = `${EVOLUTION_API_URL}/message/sendText/${instanceName}`;
    console.log('URL da API:', apiUrl);
    console.log('Payload:', JSON.stringify(messagePayload, null, 2));

    const response = await axios.post(
      apiUrl,
      messagePayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'apikey': EVOLUTION_API_KEY
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erro completo:', error);
    console.error('URL utilizada:', `${EVOLUTION_API_URL}/message/sendText/${instanceName}`);
    console.error('Configurações:', {
      apiUrl: EVOLUTION_API_URL,
      apiKey: EVOLUTION_API_KEY ? 'Presente' : 'Ausente',
      workspaceId,
      instanceId,
      instanceName
    });
    throw error;
  }
};

// Função para processar variáveis na mensagem com validação
const processMessageVariables = (message, contact) => {
  if (!message || !contact) {
    throw new Error('Mensagem ou dados do contato inválidos');
  }

  let processedMessage = message;
  Object.entries(contact).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const regex = new RegExp(`{{${key}}}`, 'gi');
      processedMessage = processedMessage.replace(regex, value.toString());
    }
  });
  return processedMessage;
};

// Função para ler arquivo do MinIO
const readFileFromMinio = async (fileUrl) => {
  try {
    const bucketName = process.env.MINIO_BUCKET || 'campaigns';
    const fileStream = await minioClient.getObject(bucketName, fileUrl);
    
    return new Promise((resolve, reject) => {
      let fileContent = '';
      
      fileStream.on('data', chunk => {
        fileContent += chunk.toString();
      });
      
      fileStream.on('end', () => {
        resolve(fileContent);
      });
      
      fileStream.on('error', error => {
        reject(error);
      });
    });
  } catch (error) {
    console.error('Erro ao ler arquivo do MinIO:', error);
    throw error;
  }
};

// Função para formatar número de telefone
const formatPhoneNumber = (numero) => {
  if (!numero) return null;
  
  // Remove tudo que não for número
  const digits = numero.toString().replace(/\D/g, '');
  
  // Se já começar com 55 e tiver o tamanho correto, retorna
  if (digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) {
    return digits;
  }
  
  // Se não começar com 55, adiciona
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`;
  
  // Verifica se tem o tamanho correto após adicionar 55
  if (withCountry.length === 12 || withCountry.length === 13) {
    return withCountry;
  }
  
  return null;
};

// Função para converter HTML para texto simples
const htmlToText = (html) => {
  // Remove todas as tags HTML, mantendo o texto
  let text = html.replace(/<[^>]*>/g, '');
  
  // Substitui <br> e </p> por quebras de linha
  text = html.replace(/<br\s*\/?>/gi, '\n')
             .replace(/<\/p>/gi, '\n')
             .replace(/<[^>]*>/g, '');
  
  // Remove quebras de linha duplicadas
  text = text.replace(/\n\s*\n/g, '\n');
  
  // Remove espaços em branco extras
  text = text.trim();
  
  // Converte entidades HTML comuns
  text = text.replace(/&nbsp;/g, ' ')
             .replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");
  
  return text;
};

// Função para converter HTML para formato WhatsApp
const htmlToWhatsAppFormat = (html) => {
  let text = html;
  
  // Primeiro, substitui as quebras de linha HTML por marcadores temporários
  text = text
    .replace(/<br\s*\/?>/gi, '{{BREAK}}')
    .replace(/<\/p><p>/gi, '{{BREAK}}{{BREAK}}')
    .replace(/<\/p>/gi, '{{BREAK}}')
    .replace(/<p>/gi, '');
    
  // Converte tags HTML para formatação WhatsApp com espaços
  text = text
    // Negrito: <strong> ou <b> para *texto*
    .replace(/<(strong|b)>(.*?)<\/\1>/gi, ' *$2* ')
    
    // Itálico: <em> ou <i> para _texto_
    .replace(/<(em|i)>(.*?)<\/\1>/gi, ' _$2_ ')
    
    // Tachado: <strike> ou <s> para ~texto~
    .replace(/<(strike|s)>(.*?)<\/\1>/gi, ' ~$2~ ')
    
    // Remove todas as outras tags HTML
    .replace(/<[^>]*>/g, '')
    
    // Converte entidades HTML
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
    
  // Substitui os marcadores temporários por \n
  text = text
    .replace(/{{BREAK}}/g, '\n')
    // Remove múltiplos espaços
    .replace(/\s+/g, ' ')
    // Remove espaços antes de pontuação
    .replace(/\s+([.,!?:;])/g, '$1')
    // Garante espaço após pontuação
    .replace(/([.,!?:;])(\S)/g, '$1 $2')
    // Remove espaços extras no início/fim
    .trim();
  
  return text;
};

// Função principal para iniciar a campanha
export const startCampaign = async (campaignId) => {
  const campaign = await Campaign.findByPk(campaignId);
  if (!campaign) {
    throw new Error('Campanha não encontrada');
  }

  console.log('\n====================================');
  console.log(`Iniciando campanha: ${campaign.name} (ID: ${campaignId})`);
  console.log('====================================\n');

  try {
    await campaign.update({ 
      status: 'IN_PROGRESS',
      lastProcessedAt: new Date()
    });

    // Lê o arquivo CSV do MinIO
    console.log('Lendo arquivo CSV do MinIO...');
    const csvContent = await readFileFromMinio(campaign.csvFileUrl);
    const contacts = parse(csvContent, { 
      columns: true, 
      skip_empty_lines: true 
    });

    console.log(`Total de contatos carregados: ${contacts.length}`);
    console.log('Exemplo do primeiro contato:', contacts[0]);

    let successCount = 0;
    let failureCount = 0;
    const totalMessages = contacts.length;

    for (const [index, contact] of contacts.entries()) {
      try {
        // Pega o valor da primeira coluna, independente do nome
        const firstColumnValue = Object.values(contact)[0];
        const numeroFormatado = formatPhoneNumber(firstColumnValue);

        if (!numeroFormatado) {
          console.error(`Contato ${index + 1} com número inválido:`, firstColumnValue);
          failureCount++;
          continue;
        }

        // Adiciona o número formatado ao objeto de contato
        const contactWithFormattedNumber = {
          ...contact,
          numeroFormatado
        };

        // Ajuste aqui: Verificando a estrutura correta da mensagem
        const message = campaign.messages[0];
        if (!message?.content) { // Mudou de principal para content
          console.error('Estrutura da mensagem:', message);
          throw new Error('Mensagem principal não encontrada na campanha');
        }

        console.log(`\nProcessando mensagem ${index + 1}/${totalMessages}`);
        console.log('Dados do contato:', contactWithFormattedNumber);

        // Usa message.content ao invés de message.principal
        const messageHtml = processMessageVariables(message.content, contactWithFormattedNumber);
        console.log('Mensagem HTML:', messageHtml);
        
        // Converte HTML para formato WhatsApp
        const whatsappText = htmlToWhatsAppFormat(messageHtml);
        console.log('Mensagem formatada para WhatsApp:', whatsappText);

        // Pega o primeiro instanceId do array e garante que é um número
        const instanceId = campaign.instanceIds[0];
        
        if (!instanceId) {
          throw new Error('ID da instância não encontrado');
        }

        // Pega o workspaceId ou usa um valor padrão (1 neste caso)
        const workspaceId = campaign.workspaceId || 1;

        await sendWhatsAppMessage(
          workspaceId,
          instanceId, // Já é um número do array
          numeroFormatado,
          whatsappText,
          campaign.messageInterval || 1
        );

        successCount++;
        console.log(`✓ Mensagem ${index + 1} enviada com sucesso`);
        
        await campaign.update({ successCount });

        io.emit('campaignUpdate', {
          campaignId,
          status: 'IN_PROGRESS',
          successCount,
          failureCount,
          totalMessages,
          currentMessage: index + 1
        });

        // Aguarda o intervalo em segundos
        const intervalInSeconds = campaign.messageInterval || 1;
        console.log(`Aguardando ${intervalInSeconds}s antes do próximo envio...`);
        await new Promise(resolve => setTimeout(resolve, intervalInSeconds * 1000));

      } catch (error) {
        console.error(`\n✗ Erro ao processar mensagem ${index + 1}/${totalMessages}:`, error.message);
        failureCount++;
        
        await campaign.update({ failureCount });
        
        io.emit('campaignError', {
          campaignId,
          error: error.message,
          contact: contact?.numeroFormatado || 'Número inválido'
        });
      }
    }

    const finalStatus = failureCount === totalMessages ? 'FAILED' : 
                       failureCount > 0 ? 'COMPLETED_WITH_ERRORS' : 
                       'COMPLETED';

    await campaign.update({ 
      status: finalStatus,
      lastProcessedAt: new Date()
    });

    console.log('\n====================================');
    console.log('Campanha finalizada');
    console.log(`Status: ${finalStatus}`);
    console.log(`Sucesso: ${successCount}`);
    console.log(`Falhas: ${failureCount}`);
    console.log('====================================\n');

    io.emit('campaignComplete', {
      campaignId,
      status: finalStatus,
      successCount,
      failureCount,
      totalMessages
    });

  } catch (error) {
    console.error('\nErro fatal ao processar campanha:', error);
    await campaign.update({ 
      status: 'FAILED',
      error: error.message,
      lastProcessedAt: new Date()
    });
    throw error;
  }
};

// Função para verificar campanhas agendadas
export const scheduleCampaigns = async () => {
  try {
    const pendingCampaigns = await Campaign.findAll({
      where: {
        status: 'PENDING',
        startImmediately: false,
        startDate: {
          [Op.lte]: new Date()
        }
      }
    });

    for (const campaign of pendingCampaigns) {
      console.log(`\nIniciando campanha agendada: ${campaign.name}`);
      startCampaign(campaign.id).catch(error => {
        console.error(`Erro ao iniciar campanha ${campaign.id}:`, error);
      });
    }
  } catch (error) {
    console.error('Erro ao verificar campanhas agendadas:', error);
  }
};

// Função para verificar campanhas imediatas
export const checkImmediateCampaigns = async () => {
  try {
    const pendingCampaigns = await Campaign.findAll({
      where: {
        status: 'PENDING',
        startImmediately: true
      }
    });

    for (const campaign of pendingCampaigns) {
      console.log(`\nIniciando campanha imediata: ${campaign.name}`);
      await startCampaign(campaign.id);
    }
  } catch (error) {
    console.error('Erro ao verificar campanhas imediatas:', error);
  }
};

// Função para iniciar o serviço de campanhas
export const initCampaignService = () => {
  console.log('Iniciando serviço de campanhas...');
  
  // Verifica campanhas imediatas a cada 10 segundos
  setInterval(checkImmediateCampaigns, 10000);
  
  // Verifica campanhas agendadas a cada minuto
  setInterval(scheduleCampaigns, 60000);
  
  // Executa uma verificação inicial
  checkImmediateCampaigns();
};
