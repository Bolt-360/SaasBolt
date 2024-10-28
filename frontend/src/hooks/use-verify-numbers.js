import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useVerifyNumbers() {
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const verifyNumbers = async ({ numbers, instanceName }) => {
    if (!numbers?.length) {
      toast({
        title: "Erro",
        description: "Nenhum número para verificar",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch('/api/whatsapp/verify-numbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          numbers,
          instanceName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao verificar números');
      }

      const data = await response.json();
      
      toast({
        title: "Sucesso",
        description: `${data.valid?.length || 0} números válidos encontrados`,
      });

      return data;
    } catch (error) {
      console.error('Erro na verificação:', error);
      toast({
        title: "Erro na verificação",
        description: error.message || "Não foi possível verificar os números",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  return { verifyNumbers, isVerifying };
}
