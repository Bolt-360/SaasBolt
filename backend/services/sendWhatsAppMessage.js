import axios from 'axios';
import { getRandomMessage } from '../utils/getRandomMessage.js';
import { processMessageVariables } from '../utils/processMessageVariables.js';
import pkg from '../config/evolutionapi.cjs';
const { EVOLUTION_API_URL, EVOLUTION_API_KEY } = pkg;

export const sendWhatsAppMessage = async (workspaceId, instanceId, contact, messages) => {
    try {

        const messageArray = Array.isArray(messages) ? messages : JSON.parse(messages);

        for (const messageObj of messageArray) {
            const selectedContent = getRandomMessage(messageObj);
            
            const processedContent = processMessageVariables(selectedContent, contact);
            
            const instancePath = `${workspaceId}-${instanceId}`;
            const url = `${EVOLUTION_API_URL}/message/sendText/${instancePath}`;

            // Formatar o número do telefone (remover caracteres especiais)
            let formattedPhone = contact.phone || '';
            formattedPhone = formattedPhone.replace(/\D/g, '');
            
            // Garantir que o número comece com 55
            if (!formattedPhone.startsWith('55')) {
                formattedPhone = '55' + formattedPhone;
            }


            const payload = {
                number: formattedPhone,
                text: processedContent,
                delay: 1000
            };

            const response = await axios.post(
                url,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': EVOLUTION_API_KEY
                    }
                }
            );

            if (response.status >= 400) {
                console.error('Erro na resposta da API:', response.data);
                throw new Error(`Erro ao enviar mensagem: ${JSON.stringify(response.data)}`);
            }
        }

        return true;
    } catch (error) {
        console.error('Erro detalhado ao enviar mensagem:', {
            error: error.message,
            contact: contact,
            response: error.response?.data
        });
        throw error;
    }
};