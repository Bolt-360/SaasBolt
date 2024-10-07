import { useState, useEffect, useCallback } from 'react';
import useConversation from '@/zustand/useConversation';
import { useToast } from "@/hooks/use-toast";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    const { toast } = useToast();

    const getMessages = useCallback(async () => {
        if (!selectedConversation?.id) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/messages/${selectedConversation.id}`);
            if (!res.ok) {
                throw new Error('Falha ao buscar mensagens');
            }
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error('Erro ao obter mensagens:', error);
            toast({
                title: "Erro ao obter mensagens",
                description: error.message,
                variant: "destructive"
            });
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, [selectedConversation?.id, setMessages, toast]);

    useEffect(() => {
        getMessages();
    }, [getMessages, selectedConversation]);

    return { loading, messages, getMessages };
};

export default useGetMessages;