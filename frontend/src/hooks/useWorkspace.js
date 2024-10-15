import { useState } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export function useWorkspace() {
  const [isLoading, setIsLoading] = useState(false);
  const { authUser, setAuthUser } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const createWorkspace = async (workspaceName, cnpj) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authUser.token}`
        },
        body: JSON.stringify({ name: workspaceName, cnpj })
      });

      const data = await response.json();

      if (response.ok) {
        setAuthUser({ ...authUser, workspaceId: data.id });
        toast({
          title: "Workspace criado com sucesso!",
          description: `Bem-vindo ao ${workspaceName}!`,
          variant: "default",
        });
        navigate('/app');
      } else {
        throw new Error(data.message || 'Erro ao criar workspace');
      }
    } catch (error) {
      toast({
        title: "Erro ao criar workspace",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinWorkspace = async (inviteCode) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/workspaces/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authUser.token}`
        },
        body: JSON.stringify({ inviteCode })
      });

      const data = await response.json();

      if (response.ok) {
        setAuthUser({ ...authUser, workspaceId: data.workspaceId });
        toast({
          title: "Entrou no workspace com sucesso!",
          description: `Bem-vindo ao workspace!`,
          variant: "default",
        });
        navigate('/app');
      } else {
        throw new Error(data.message || 'Erro ao entrar no workspace');
      }
    } catch (error) {
      toast({
        title: "Erro ao entrar no workspace",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { createWorkspace, joinWorkspace, isLoading };
}
