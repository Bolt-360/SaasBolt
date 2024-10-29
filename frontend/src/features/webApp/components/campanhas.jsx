import { useEffect, useState } from 'react';
import { useSocketContext } from '@/context/SocketContext';
import { useAuthContext } from '@/context/AuthContext';
import { Card } from "@/components/ui/card"

export default function Campanhas() {
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const [messageStats, setMessageStats] = useState({
    total: 0,
    success: 0,
    error: 0,
    activeInstances: 0
  });

  useEffect(() => {
    if (!socket || !authUser?.activeWorkspaceId) return;

    // Entrar na sala do workspace
    socket.emit('joinWorkspaceRoom', authUser.activeWorkspaceId);

    // Eventos de instância
    socket.on('instanceStatusUpdate', (data) => {
      console.log('Status da instância atualizado:', data);
      setMessageStats(prev => ({
        ...prev,
        activeInstances: data.activeInstances || prev.activeInstances
      }));
    });

    // Eventos de mensagens
    socket.on('messageSuccess', (data) => {
      console.log('Mensagem enviada com sucesso:', data);
      setMessageStats(prev => ({
        ...prev,
        total: prev.total + 1,
        success: prev.success + 1
      }));
    });

    socket.on('messageError', (data) => {
      console.log('Erro no envio da mensagem:', data);
      setMessageStats(prev => ({
        ...prev,
        total: prev.total + 1,
        error: prev.error + 1
      }));
    });

    // Cleanup
    return () => {
      socket.emit('leaveWorkspaceRoom', authUser.activeWorkspaceId);
      socket.off('instanceStatusUpdate');
      socket.off('messageSuccess');
      socket.off('messageError');
    };
  }, [socket, authUser?.activeWorkspaceId]);

  // Atualizar os cards com as estatísticas
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3>Mensagens Enviadas</h3>
            <p>{messageStats.total}</p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3>Taxa de Sucesso</h3>
            <p>{messageStats.total > 0 ? 
              ((messageStats.success / messageStats.total) * 100).toFixed(1) + '%' 
              : '0%'}
            </p>
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3>Instâncias Ativas</h3>
            <p>{messageStats.activeInstances}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}