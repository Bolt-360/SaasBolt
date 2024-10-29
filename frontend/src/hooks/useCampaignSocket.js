import { useEffect, useState } from 'react';
import { useSocketContext } from '@/context/SocketContext';
import { useAuthContext } from '@/context/AuthContext';
import { useFetchCampaign } from './useFetchCampaign';

export const useCampaignSocket = () => {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const { campanhas: initialCampaigns, fetchCampanhas } = useFetchCampaign();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [campaignsStatus, setCampaignsStatus] = useState({});

  // Sincroniza o estado inicial
  useEffect(() => {
    setCampaigns(initialCampaigns);
  }, [initialCampaigns]);

  useEffect(() => {
    if (!socket || !authUser?.activeWorkspaceId) return;

    console.log('🔌 Socket conectado e pronto');
    socket.emit('joinWorkspaceRoom', authUser.activeWorkspaceId);
    console.log('👋 Entrando na sala do workspace:', authUser.activeWorkspaceId);

    socket.on('campaignStatusChanged', (data) => {
      console.log('📊 Status da campanha alterado:', {
        campaignId: data.campaignId,
        oldStatus: data.previousStatus,
        newStatus: data.newStatus
      });
      
      // Atualiza o estado e busca dados atualizados
      setCampaigns(prevCampaigns => {
        const updatedCampaigns = prevCampaigns.map(campaign => 
          campaign.id === data.campaignId 
            ? { ...campaign, status: data.newStatus }
            : campaign
        );
        return updatedCampaigns;
      });
      
      // Busca dados atualizados do servidor
      fetchCampanhas();
    });

    socket.on('campaignProgress', (data) => {
      console.log('📈 Progresso da campanha:', data);
      
      setCampaignsStatus(prev => ({
        ...prev,
        [data.campaignId]: {
          progress: data.progress.percentage,
          currentCount: data.progress.currentCount,
          totalMessages: data.progress.totalMessages,
          stats: data.stats,
          status: data.status
        }
      }));

      // Atualiza o status da campanha na lista
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign =>
          campaign.id === data.campaignId
            ? { 
                ...campaign, 
                status: data.status,
                progress: data.progress.percentage
              }
            : campaign
        )
      );
    });

    socket.on('campaignCompleted', (data) => {
      console.log('🏁 Campanha finalizada:', data);
      
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign =>
          campaign.id === data.campaignId
            ? { 
                ...campaign,
                status: data.status,
                stats: data.stats
              }
            : campaign
        )
      );

      // Busca dados atualizados após conclusão
      fetchCampanhas();
    });

    return () => {
      console.log('👋 Saindo da sala do workspace:', authUser.activeWorkspaceId);
      socket.emit('leaveWorkspaceRoom', authUser.activeWorkspaceId);
      socket.off('campaignStatusChanged');
      socket.off('campaignProgress');
      socket.off('campaignCompleted');
    };
  }, [socket, authUser?.activeWorkspaceId, fetchCampanhas]);

  return { campaigns, campaignsStatus };
};
