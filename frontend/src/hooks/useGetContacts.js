import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const useGetContacts = () => {
    const [loading, setLoading] = useState(true);
    const [contacts, setContacts] = useState([]);
    const { toast } = useToast();

    useEffect(() => {
        const getContacts = async () => {
            try {
                const res = await fetch("/api/users");
                const data = await res.json();
                
                if(data.error) {
                    toast({
                        title: data.error,
                        description: "Ocorreu um erro ao buscar os contatos.",
                        variant: "destructive",
                    });
                    setContacts([]); // Garante que contacts seja um array vazio em caso de erro
                } else {
                    setContacts(data);
                }
            } catch (error) {
                toast({
                    title: "Erro ao buscar contatos",
                    description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
                    variant: "destructive",
                });
                setContacts([]); // Garante que contacts seja um array vazio em caso de erro
            } finally {
                setLoading(false);
            }
        }

        getContacts();
    }, [toast]);

    return { loading, contacts };
}

export default useGetContacts;