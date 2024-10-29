import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from '@/context/AuthContext';
import { useSocketContext } from '@/context/SocketContext';

export const useFetchCampaign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campanhas, setCampanhas] = useState([]);
  const [campanhasStatus, setCampanhasStatus] = useState({});
  const { toast } = useToast();
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();
  const workspaceId = authUser.activeWorkspaceId;

  // Busca inicial das campanhas
  useEffect(() => {
    fetchCampanhas();
  }, [workspaceId]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    // Atualização de progresso da campanha
    socket.on('campaignUpdate', handleCampaignUpdate);
    socket.on('campaignComplete', handleCampaignComplete);
    socket.on('campaignError', handleCampaignError);

    return () => {
      if (socket) {
        socket.off('campaignUpdate', handleCampaignUpdate);
        socket.off('campaignComplete', handleCampaignComplete);
        socket.off('campaignError', handleCampaignError);
      }
    };
  }, [socket]); // Adiciona socket como dependência

  const handleCampaignUpdate = (data) => {
    setCampanhasStatus(prev => ({
      ...prev,
      [data.campaignId]: {
        status: data.status,
        progress: Math.round((data.currentMessage / data.totalMessages) * 100),
        successCount: data.successCount,
        failureCount: data.failureCount,
        totalMessages: data.totalMessages,
        currentMessage: data.currentMessage
      }
    }));

    // Atualiza também o status na lista de campanhas
    setCampanhas(prev => prev.map(camp => 
      camp.id === data.campaignId 
        ? { 
            ...camp, 
            status: data.status,
            successCount: data.successCount,
            failureCount: data.failureCount
          }
        : camp
    ));
  };

  const handleCampaignComplete = (data) => {
    setCampanhas(prev => prev.map(camp => 
      camp.id === data.campaignId 
        ? { 
            ...camp, 
            status: data.status,
            successCount: data.successCount,
            failureCount: data.failureCount,
            totalMessages: data.totalMessages,
            error: data.error
          }
        : camp
    ));

    setCampanhasStatus(prev => ({
      ...prev,
      [data.campaignId]: {
        status: data.status,
        progress: 100,
        successCount: data.successCount,
        failureCount: data.failureCount,
        totalMessages: data.totalMessages,
        error: data.error
      }
    }));

    toast({
      title: data.status === 'FAILED' ? "Erro na Campanha" : "Campanha Finalizada",
      description: data.error || 
        `Status: ${data.status}, Sucesso: ${data.successCount}, Falhas: ${data.failureCount}`,
      variant: data.status === 'FAILED' ? "destructive" : "default",
    });
  };

  const handleCampaignError = (data) => {
    // Atualiza o status da campanha com erro
    setCampanhas(prev => prev.map(camp => 
      camp.id === data.campaignId 
        ? { ...camp, status: 'FAILED', error: data.error }
        : camp
    ));

    toast({
      title: "Erro na Campanha",
      description: data.error,
      variant: "destructive",
    });
  };

  const fetchCampanhas = async () => {
    if (!workspaceId) return;
    
    setIsLoading(true);
    try {
        const response = await fetch(`/api/campaigns/${workspaceId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
        });
        
        if (!response.ok) {
            throw new Error('Falha ao buscar campanhas');
        }
        
        const data = await response.json();
        setCampanhas(data);
    } catch (error) {
        console.error('Erro ao buscar campanhas:', error);
        toast({
            title: "Erro",
            description: "Falha ao carregar campanhas. Tente novamente mais tarde.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const createCampaign = async (formData) => {
    try {
      // Criar FormData
      const form = new FormData();
      
      // Adicionar campos básicos
      form.append('name', formData.nome);
      form.append('type', formData.tipo.toUpperCase());
      form.append('startImmediately', formData.inicioImediato.toString());
      form.append('messageInterval', formData.intervalo.toString());
      
      // Adicionar mensagens
      const messages = formData.mensagens.map(msg => ({
        type: "TEXT",
        content: msg.principal,
        variations: msg.alternativas.filter(alt => alt.trim() !== '')
      }));
      form.append('messages', JSON.stringify(messages));
      
      // Adicionar instanceId
      form.append('instanceIds', JSON.stringify([formData.instancia]));
      
      // Adicionar arquivo CSV
      if (formData.csvFile) {
        form.append('csv', formData.csvFile);
      }

      const response = await fetch(`/api/campaigns/${workspaceId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          // Não incluir Content-Type, o browser vai definir automaticamente
        },
        body: form
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar campanha');
      }

      setCampanhas(prev => [data.data, ...prev]);
      
      toast({
        title: "Sucesso",
        description: "Campanha criada com sucesso",
      });

      return data.data;

    } catch (error) {
      console.error('Erro ao criar campanha:', error);
      toast({
        title: "Erro",
        description: error.message || "Falha ao criar campanha",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { 
    createCampaign, 
    isLoading, 
    campanhas, 
    campanhasStatus,
    fetchCampanhas
  };
};
