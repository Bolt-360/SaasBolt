import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const handleInputError = (email, password) => {
    if (!email || !password) {
        return "Preencha todos os campos";
    }
    return null;
}

const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { setAuthUser } = useAuthContext();
    const { toast } = useToast();
    const navigate = useNavigate();

    const login = async (email, password) => {
        const errorMessage = handleInputError(email, password);
        if (errorMessage) {
            toast({
                title: errorMessage,
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true);

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!data.token) {
                toast({
                    title: data.message || "Erro ao fazer login",
                    description: "Credenciais inválidas ou usuário não encontrado.",
                    variant: "destructive",
                });
                return;
            }

            // Se chegou aqui, o login foi bem-sucedido (temos um token)
            localStorage.setItem("user", JSON.stringify(data));
            setAuthUser(data);
            toast({
                title: "Login realizado com sucesso!",
                description: `Bem-vindo, ${data.username || 'usuário'}!`,
                variant: "default",
            });
        } catch (error) {
            console.error("Erro durante o login:", error);
            toast({
                title: "Erro ao fazer login",
                description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return { login, isLoading };
}

export default useLogin;