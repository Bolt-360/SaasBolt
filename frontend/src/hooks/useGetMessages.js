import { useCallback } from 'react';
import useConversation from '@/zustand/useConversation';
import { useToast } from "@/hooks/use-toast";

const useGetMessages = () => {
    const { messages, setMessages, addMessage, selectedConversation } = useConversation();
    const { toast } = useToast();

    const getMessages = useCallback(async () => {
        if (!selectedConversation?.otherParticipant?.id) return;

        try {
            const res = await fetch(`/api/messages/${selectedConversation.otherParticipant.id}`);
            if (!res.ok) {
                throw new Error('Falha ao buscar mensagens');
            }
            const data = await res.json();
            setMessages(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Erro ao obter mensagens:', error);
            toast({
                title: "Erro ao obter mensagens",
                description: error.message,
                variant: "destructive"
            });
            setMessages([]);
        }
    }, [selectedConversation?.otherParticipant?.id, setMessages, toast]);

    return { messages, getMessages, addMessage };
};

export default useGetMessages;