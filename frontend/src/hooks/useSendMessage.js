import useConversation from "@/zustand/useConversation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const useSendMessage = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const { selectedConversation } = useConversation();

    const sendMessage = async (content) => {
        if (!selectedConversation?.otherParticipant?.id) {
            toast({
                title: 'Erro ao enviar mensagem',
                description: 'Nenhuma conversa selecionada',
                variant: 'destructive'
            });
            return null;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/messages/send/${selectedConversation.otherParticipant.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: content })
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar mensagem');
            }

            const responseData = await response.json();         
            return responseData.data; // Retorna apenas os dados da mensagem
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            toast({
                title: 'Erro ao enviar mensagem',
                description: error.message,
                variant: 'destructive'
            });
            return null;
        } finally {
            setLoading(false);
        }
    }

    return { sendMessage, loading };    
}

export default useSendMessage;