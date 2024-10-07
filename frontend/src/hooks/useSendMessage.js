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

            const data = await response.json();

            if (response.ok) {
                const updatedMessages = [...messages, data];
                setMessages(updatedMessages);
                setStatus('success');
            } else {
                throw new Error(data.error || 'Erro ao enviar mensagem');
            }

        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            toast({
                title: 'Erro ao enviar mensagem',
                description: error.message,
                variant: 'destructive'
            });
            setStatus('error');
        } finally {
            setLoading(false);
        }
    }

    return { sendMessage, loading, status };    
}

export default useSendMessage;