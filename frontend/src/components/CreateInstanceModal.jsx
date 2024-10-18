import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateInstance } from '@/hooks/useCreateInstance';
import { connectInstance } from '@/api/connectInstance';
import { useAuthContext } from '@/context/AuthContext';
import { useSocketContext } from '@/context/SocketContext';


export default function CreateInstanceModal({ isOpen, onClose }) {
  const [instanceName, setInstanceName] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [progress, setProgress] = useState(100);
  const { createInstance, isLoading } = useCreateInstance();
  const { authUser } = useAuthContext();
  const workspaceId  = authUser.activeWorkspaceId;
  const { socket } = useSocketContext();

  useEffect(() => {
    if(socket){
      socket.on('qrcodeUpdated', (data) => {
        if (data.instance === instanceName) {
          setQrCode(data.qrcode);
          console.log("QR Code atualizado:", data.qrcode);
        }
      });
    }
  }, [socket, instanceName]);

  const socketRefreshQRCode = async () => {
    if(socket){
      socket.emit('refreshQRCode', { instance: instanceName });
    }
  }

  const handleCreateInstance = async () => {
    try {
      await createInstance(instanceName, workspaceId);
      const qrCodeData = await connectInstance(instanceName, authUser.token, authUser.activeWorkspaceId);
      setQrCode(qrCodeData);
    } catch (error) {
      console.error('Erro ao criar instância:', error);
    }
  };

  const handleRefreshQRCode = async () => {
    try {
      const qrCodeData = await connectInstance(instanceName, authUser.token);
      setQrCode(qrCodeData);
      } catch (error) {
      console.error('Erro ao atualizar QR Code:', error);
    }
  };

  const resetValues = () => {
    setInstanceName('');
    setQrCode(null);
  };

  const handleClose = () => {
    resetValues();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {qrCode ? 'Escaneie o QR Code' : 'Criar Nova Instância'}
          </DialogTitle>
        </DialogHeader>
        {!qrCode ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={instanceName}
                onChange={(e) => setInstanceName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <Button onClick={handleCreateInstance} disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Instância'}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <img src={qrCode} alt="QR Code para conexão" className="w-64 h-64 mb-4" />
            <p className="mt-4 text-sm text-gray-500 mb-4">
              Escaneie este QR Code com o WhatsApp no seu celular para conectar a instância.
            </p>
            <Button onClick={handleRefreshQRCode}>Atualizar QR Code</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
