import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, LogIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ModalWorkspace({ isOpen, onClose, initialView }) {
  const [view, setView] = useState(initialView);
  const [code, setCode] = useState(['', '', '', '', '']);
  const [workspaceName, setWorkspaceName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setView(initialView);
  }, [initialView]);

  const handleCodeChange = (index, value) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 4) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleVerifyCode = () => {
    const fullCode = code.join('');
    if (fullCode.length === 5) {
      console.log('Verifying code:', fullCode);
      setError('');
    } else {
      setError('Por favor, insira um código válido de 5 dígitos.');
    }
  };

  const handleCreateWorkspace = () => {
    if (workspaceName && cnpj) {
      console.log('Creating workspace:', { workspaceName, cnpj });
      setError('');
    } else {
      setError('Por favor, preencha todos os campos.');
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'enter':
        return (
          <>
            <div className="flex justify-between mb-4">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center text-2xl"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                />
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button className="w-full mb-2" onClick={handleVerifyCode}>Verificar</Button>
          </>
        );
      case 'create':
        return (
          <>
            <div className="space-y-4 mb-4">
              <div>
                <Label htmlFor="workspace-name">Nome do Workspace</Label>
                <Input
                  id="workspace-name"
                  placeholder="Digite o nome do workspace"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cnpj">CNPJ</Label>
                <Input
                  id="cnpj"
                  placeholder="Digite o CNPJ"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button className="w-full mb-2" onClick={handleCreateWorkspace}>Criar Workspace</Button>
          </>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {view === 'enter' ? 'Entrar em uma Empresa Existente' : 
             'Cadastrar uma nova Empresa'}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
