import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const useGetListConversations = () => {
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
    const { toast } = useToast();
    
    useEffect(() => {
        const getConversations = async () => {
            try {
                setLoading(true);

                const res = await fetch("/api/conversations");
                const data = await res.json();
                
                if (!res.ok) {
                    throw new Error(data.error || "Erro ao buscar conversas");
                }

                const currentUser = JSON.parse(localStorage.getItem('user'));

                const formattedConversations = data.map(conv => {
                    const otherParticipant = conv.participantUsers.find(p => p.id !== currentUser.id);
                    return {
                        id: conv.id,
                        participants: conv.participants,
                        otherParticipant: otherParticipant,
                        lastMessage: conv.messages[0] ? {
                            id: conv.messages[0].id,
                            content: conv.messages[0].content,
                            senderId: conv.messages[0].senderId,
                            createdAt: conv.messages[0].createdAt
                        } : null
                    };
                });
                setConversations(formattedConversations);
            } catch (error) {
                console.error("Erro ao buscar conversas:", error);
                toast({
                    title: "Erro ao buscar conversas",
                    description: error.message || "Ocorreu um erro inesperado. Por favor, tente novamente.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }

        getConversations();
    }, [toast]);

    return { loading, conversations };
}

export default useGetListConversations;