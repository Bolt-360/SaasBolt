import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useFetchCampaign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createCampaign = async (formData, workspaceId) => {
    setIsLoading(true);
    try {
      const formDataToSubmit = new FormData();

      formDataToSubmit.append('name', formData.nome);
      formDataToSubmit.append('type', formData.tipo.toUpperCase());
      formDataToSubmit.append('startImmediately', formData.inicioImediato.toString());
      
      // Se início imediato, use a data atual, caso contrário use a data fornecida
      const startDate = formData.inicioImediato 
        ? new Date().toISOString() 
        : formData.dataInicio 
          ? new Date(formData.dataInicio).toISOString() 
          : new Date().toISOString();
      
      formDataToSubmit.append('startDate', startDate);
      formDataToSubmit.append('messageInterval', formData.intervalo);

      const messages = formData.mensagens.map(msg => ({
        type: "TEXT",
        content: msg.principal,
        variations: msg.alternativas.filter(alt => alt.trim() !== '')
      }));
      formDataToSubmit.append('messages', JSON.stringify(messages));

      if (formData.csvFile) {
        formDataToSubmit.append('csv', formData.csvFile);
      }

      const instanceIds = formData.instancia ? [parseInt(formData.instancia, 10)] : [];
      if (instanceIds.length === 0) {
        throw new Error('Instance ID is required');
      }
      formDataToSubmit.append('instanceIds', JSON.stringify(instanceIds));

      if (formData.arquivo) {
        formDataToSubmit.append('image', formData.arquivo);
      }

      const response = await fetch(`/api/campaigns/${workspaceId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSubmit,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao criar a campanha');
      }

      const result = await response.json();
      toast({
        title: "Sucesso!",
        description: "Campanha criada com sucesso.",
      });
      return result;
    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar a campanha. Por favor, tente novamente.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createCampaign, isLoading };
};
