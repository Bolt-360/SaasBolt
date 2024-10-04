import useConversation from '@/zustand/useConversation';
import React, { useEffect, useState } from 'react'
import { useToast } from "@/hooks/use-toast";


const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectConversation } = useConversation();
    const { toast } = useToast();
    useEffect(() => {
        const getMessages = async () => {
            try {
                setLoading(true);

                const res = await fetch(`/api/messages/${selectConversation?.id}`);

                const data = await res.json();

                if(data.error){
                    throw new Error(data.error);
                }

                setMessages(data);
            } catch (error) {
                toast({
                    title: "Erro ao obter mensagens",
                    description: error.message,
                    variant: "destructive"
                })
            }finally {
                setLoading(false);
            }
        }

        if(selectConversation?.id){
            getMessages();
        }
    }, [selectConversation?.id, setMessages])

    return { loading, messages };
}

export default useGetMessages