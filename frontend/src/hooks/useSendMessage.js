import useConversation from "@/zustand/useConversation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const useSendMessage = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle', 'success', 'error'
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (message) => {
        if (!selectedConversation) {
            toast({
                title: 'Erro ao enviar mensagem',
                description: 'Nenhuma conversa selecionada',
                variant: 'destructive'
            });
            return;
        }

        try {
            setLoading(true);
            setStatus('idle');

            const response = await fetch(`/api/messages/send/${selectedConversation.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar mensagem');
            }

            const data = await response.json();
            const updatedMessages = [...messages, data];
            setMessages(updatedMessages);
            setStatus('success');

            setTimeout(() => setStatus('idle'), 1000);

        } catch (error) {
            toast({
                title: 'Erro ao enviar mensagem',
                description: error.message,
                variant: 'destructive'
            });
            setStatus('error');
            setTimeout(() => setStatus('idle'), 1000);
        } finally {
            setLoading(false);
        }
    }

    return { sendMessage, loading, status };    
}

export default useSendMessage;