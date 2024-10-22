'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSocketContext } from '@/context/SocketContext'
import { useInstancesFetch } from '@/hooks/useInstancesFetch'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, QrCode, Power, Trash2, Plus, Search } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import CreateInstanceModal from '@/components/CreateInstanceModal'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ListarInstancias() {
  const { instances, isLoading, error, updateInstance, addInstance, removeInstance } = useInstancesFetch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState(null);
  const { socket } = useSocketContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (socket) {
      socket.on('instanceUpdated', updateInstance);
      socket.on('instanceCreated', (newInstance) => {
        addInstance(newInstance);
      });
      socket.on('instanceDeleted', removeInstance);
      socket.on('instanceEvent', handleInstanceEvent);
      socket.on('instanceDisconnected', (instanceName) => {
        updateInstance({ name: instanceName, connectionStatus: 'closed' });
      });
    }

    return () => {
      if (socket) {
        socket.off('instanceUpdated', updateInstance);
        socket.off('instanceCreated', addInstance);
        socket.off('instanceDeleted', removeInstance);
        socket.off('instanceEvent', handleInstanceEvent);
        socket.off('instanceDisconnected');
      }
    }
  }, [socket, updateInstance, addInstance, removeInstance]);

  useEffect(() => {
    console.log('Instances atualizadas:', instances);
  }, [instances]);

  const handleInstanceEvent = (eventData) => {
    const { event, instance, data } = eventData;
    
    updateInstance({
      id: instance,
      ...data
    });
  };

  const getStatusBadge = (status) => {
    if (status === "open") {
      return <Badge className="bg-green-500">Conectado</Badge>
    } else {
      return <Badge className="bg-red-500">Desconectado</Badge>
    }
  }

  const formatPhoneNumber = (ownerJid) => {
    if (!ownerJid) return '';
    const number = ownerJid.split('@')[0];
    return number.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, '+$1 ($2) $3-$4');
  }

  const isConnected = (status) => {
    return status === "open";
  }

  const sortedAndFilteredInstances = useMemo(() => {
    return instances
      .filter(instance => {
        const matchesSearch = 
          (instance.name && instance.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (instance.ownerJid && instance.ownerJid.includes(searchTerm));
        const matchesStatus = 
          statusFilter === 'all' || 
          (statusFilter === 'connected' && isConnected(instance.connectionStatus)) ||
          (statusFilter === 'disconnected' && !isConnected(instance.connectionStatus));
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Primeiro, ordenar por status de conexão
        if (isConnected(a.connectionStatus) && !isConnected(b.connectionStatus)) return -1;
        if (!isConnected(a.connectionStatus) && isConnected(b.connectionStatus)) return 1;
        
        // Se o status de conexão for o mesmo, ordenar por updatedAt
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      });
  }, [instances, searchTerm, statusFilter]);

  const handleGenerateQR = (instance) => {
    setSelectedInstance(instance);
    setIsCreateModalOpen(true);
  }

  const handleDisconnect = (instanceId) => {
    if (socket) {
      socket.emit('disconnectInstance', { instanceId });
    }
  };

  const handleDelete = (instanceId) => {
    // Implementar lógica para deletar
  }

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 flex flex-col bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Listar Instâncias</h2>
            <Button onClick={() => {
              setSelectedInstance(null);
              setIsCreateModalOpen(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Criar Instância
            </Button>
          </div>
          
          <div className="mb-4 flex space-x-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Buscar por nome ou número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="connected">Conectado</SelectItem>
                <SelectItem value="disconnected">Desconectado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 overflow-hidden bg-white shadow-md rounded-lg mb-4">
            {sortedAndFilteredInstances.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-xl text-gray-500">Nenhuma instância encontrada</p>
              </div>
            ) : (
              <div className="overflow-y-auto h-full" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky top-0 bg-white">Nome da Instância</TableHead>
                      <TableHead className="sticky top-0 bg-white">Número Conectado</TableHead>
                      <TableHead className="sticky top-0 bg-white">Status</TableHead>
                      <TableHead className="sticky top-0 bg-white text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedAndFilteredInstances.map((instance) => (
                      <TableRow key={instance.id || Math.random()}>
                        <TableCell className="font-medium">{instance.name || 'Sem nome'}</TableCell>
                        <TableCell>
                          {isConnected(instance.connectionStatus) 
                            ? formatPhoneNumber(instance.ownerJid) 
                            : '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(instance.connectionStatus)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-5 w-5" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!isConnected(instance.connectionStatus) && (
                                <DropdownMenuItem onClick={() => handleGenerateQR(instance)}>
                                  <QrCode className="mr-2 h-4 w-4" />
                                  <span>Gerar QR Code</span>
                                </DropdownMenuItem>
                              )}
                              {isConnected(instance.connectionStatus) && (
                                <DropdownMenuItem onClick={() => handleDisconnect(instance.id)}>
                                  <Power className="mr-2 h-4 w-4" />
                                  <span>Desconectar</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(instance.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Deletar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>
      <CreateInstanceModal 
        isOpen={isCreateModalOpen} 
        onClose={() => {
          setIsCreateModalOpen(false);
          setSelectedInstance(null);
        }}
        selectedInstance={selectedInstance}
      />
    </div>
  )
}
