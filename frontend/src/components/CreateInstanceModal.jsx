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

const TIMER_DURATION = 40; // 40 segundos

export default function CreateInstanceModal({ isOpen, onClose }) {
  const [instanceName, setInstanceName] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [progress, setProgress] = useState(100);
  const { createInstance, isLoading } = useCreateInstance();

  useEffect(() => {
    let intervalId;
    if (qrCode && timer > 0) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
        setProgress((prevProgress) => (prevProgress - 100 / TIMER_DURATION).toFixed(2));
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [qrCode, timer]);

  useEffect(() => {
    if (timer === 0) {
      handleRefreshQRCode();
    }
  }, [timer]);

  const handleCreateInstance = async () => {
    if (instanceName) {
      try {
        const response = await createInstance(instanceName);
        if (response.evolutionApiResponse && response.evolutionApiResponse.qrcode) {
          setQrCode(response.evolutionApiResponse.qrcode.base64);
        }
      } catch (error) {
        console.error('Erro ao criar instância:', error);
      }
    }
  };

  const handleRefreshQRCode = async () => {
    try {
      const newQrCode = await connectInstance(instanceName);
      setQrCode(newQrCode);
      setTimer(TIMER_DURATION);
      setProgress(100);
    } catch (error) {
      console.error('Erro ao atualizar QR Code:', error);
    }
  };

  const handleClose = () => {
    setInstanceName('');
    setQrCode(null);
    setTimer(TIMER_DURATION);
    setProgress(100);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
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
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="mb-4">Tempo restante: {timer} segundos</p>
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
