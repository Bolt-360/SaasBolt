import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FaRegSmile } from 'react-icons/fa'; // Importando ícone de confete

const InviteUserModal = ({ isOpen, onClose, user }) => {
  const [code, setCode] = useState(Array(5).fill('')); // Inicializa um array de 5 dígitos
  const [hasPermission, setHasPermission] = useState(true); // Estado para verificar permissão
  const [isCopied, setIsCopied] = useState(false); // Estado para controle de cópia

  useEffect(() => {
    if (user && user.workspaces) {
      const activeWorkspace = user.workspaces.find(workspace => workspace.id === user.activeWorkspaceId);
      if (activeWorkspace && activeWorkspace.inviteLink) { // Verifica se o inviteLink existe
        const inviteLink = activeWorkspace.inviteLink;
        setCode(inviteLink.split('')); // Preenche o código com os dígitos do inviteLink
        setHasPermission(true); // Permissão concedida
      } else {
        setCode(Array(5).fill('')); // Reseta o código se não houver inviteLink
        setHasPermission(false); // Sem permissão
      }
    }
  }, [user]);

  const handleCopy = () => {
    const inviteCode = code.join(''); // Junta os dígitos em uma string
    navigator.clipboard.writeText(inviteCode);
    setIsCopied(true); // Atualiza o estado para indicar que o código foi copiado

    // Reseta o estado após 2 segundos
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Usuário</DialogTitle>
          <DialogDescription>
            Para convidar um usuário, peça para ele se cadastrar e depois entrar em uma empresa usando o código abaixo:
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-4">
          {hasPermission ? (
            code.map((digit, index) => (
              <input
                key={index}
                id={`digit-${index}`}
                type="text"
                value={digit}
                readOnly // Impede que o usuário digite
                className="w-10 h-10 text-center border rounded mx-1"
                maxLength={1}
              />
            ))
          ) : (
            <p className="text-red-500">Você não tem permissão para ver o código. Entre em contato com o administrador.</p>
          )}
        </div>
        <div className="flex justify-center mt-4">
          <Button onClick={handleCopy} className="mr-2">
            {isCopied ? 'Código copiado! ' : 'Copiar Código'} 
            {isCopied && <FaRegSmile className="inline ml-1" />} {/* Ícone de confete */}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;