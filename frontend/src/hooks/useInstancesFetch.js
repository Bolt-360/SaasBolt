import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useSocketContext } from '@/context/SocketContext';

export const useInstancesFetch = () => {
  const [instances, setInstances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser } = useAuthContext();
  const { socket } = useSocketContext();

  const fetchInstances = useCallback(async () => {
    if (!authUser?.activeWorkspaceId || !authUser?.token) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/instances/list/${authUser.activeWorkspaceId}`, {
        headers: { 
          'Authorization': `Bearer ${authUser.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao carregar instâncias');
      }

      const data = await response.json();
      setInstances(data);
      setError(null);

    } catch (err) {
      setError('Erro ao carregar instâncias');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.activeWorkspaceId, authUser?.token]);

  useEffect(() => {
    fetchInstances();
  }, [fetchInstances]);

  useEffect(() => {
    if (socket && authUser?.activeWorkspaceId) {
      socket.emit('joinListAllInstancesRoom', { workspaceId: authUser.activeWorkspaceId });

      const handleInstanceEvent = (eventData) => {
        const { event, instance, data } = eventData;
        setInstances(prev => prev.map(inst => 
          inst.name === instance ? { ...inst, ...data } : inst
        ));
      };

      const handleInstanceDisconnected = (instanceName) => {
        setInstances(prev => prev.map(inst => 
          inst.name === instanceName ? { ...inst, connectionStatus: 'closed' } : inst
        ));
      };

      socket.on('instanceEvent', handleInstanceEvent);
      socket.on('qrcodeUpdated', handleInstanceEvent);
      socket.on('connectionUpdate', handleInstanceEvent);
      socket.on('instanceDisconnected', handleInstanceDisconnected);

      const handleInstanceCreated = (newInstance) => {
        console.log('Recebido evento instanceCreated:', newInstance);
        setInstances(prev => {
          const existingIndex = prev.findIndex(instance => instance.id === newInstance.id);
          if (existingIndex !== -1) {
            // Se a instância já existe, atualize-a
            return prev.map((instance, index) => 
              index === existingIndex ? { ...instance, ...newInstance, name: newInstance.name.split('-').pop() } : instance
            );
          } else {
            // Se a instância não existe, adicione-a
            return [...prev, { ...newInstance, name: newInstance.name.split('-').pop() }];
          }
        });
      };

      socket.on('instanceCreated', handleInstanceCreated);

      return () => {
        socket.emit('leaveListAllInstancesRoom', { workspaceId: authUser.activeWorkspaceId });
        socket.off('instanceEvent', handleInstanceEvent);
        socket.off('qrcodeUpdated', handleInstanceEvent);
        socket.off('connectionUpdate', handleInstanceEvent);
        socket.off('instanceDisconnected', handleInstanceDisconnected);
        socket.off('instanceCreated');
      };
    }
  }, [socket, authUser?.activeWorkspaceId]);

  const updateInstance = useCallback((updatedInstance) => {
    setInstances(prevInstances => 
      prevInstances.map(instance => {
        if (instance.id === updatedInstance.id || instance.name === updatedInstance.name) {
          return { ...instance, ...updatedInstance };
        }
        return instance;
      })
    );
  }, []);

  const addInstance = useCallback((newInstance) => {
    setInstances(prev => [...prev, newInstance]);
  }, []);

  const removeInstance = useCallback((deletedId) => {
    setInstances(prev => prev.filter(instance => instance.id !== deletedId));
  }, []);

  const joinInstanceRoom = useCallback((instanceName) => {
    if (socket) {
      socket.emit('joinInstanceRoom', { instance: instanceName });
    }
  }, [socket]);

  const leaveInstanceRoom = useCallback((instanceName) => {
    if (socket) {
      socket.emit('leaveInstanceRoom', { instance: instanceName });
    }
  }, [socket]);

  return {
    instances,
    isLoading,
    error,
    fetchInstances,
    updateInstance,
    addInstance,
    removeInstance,
    joinInstanceRoom,
    leaveInstanceRoom
  };
};
