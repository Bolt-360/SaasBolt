import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const useGetContacts = () => {
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const { toast } = useToast();
    
    useEffect(() => {
        const getContacts = async () => {
            try {
                setLoading(true);

                const res = await fetch("/api/users");
                const data = await res.json();
                
                if (!res.ok) {
                    throw new Error(data.error || "Erro ao buscar contatos");
                }

                setContacts(data);
            } catch (error) {
                console.error("Erro ao buscar contatos:", error);
                toast({
                    title: "Erro ao buscar contatos",
                    description: error.message || "Ocorreu um erro inesperado. Por favor, tente novamente.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        }

        getContacts();
    }, [toast]);

    return { loading, contacts };
}

export default useGetContacts;