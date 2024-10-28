import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useVerifyNumbers() {
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const verifyNumbers = async (numbers, instanceName) => {
    setIsVerifying(true);
    try {
      const response = await fetch('http://localhost:2345/api/whatsapp/verify-numbers', {
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

      return await response.json();
    } catch (error) {
      console.error('Erro na verificação:', error);
      toast({
        title: "Erro na verificação",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  return { verifyNumbers, isVerifying };
}

