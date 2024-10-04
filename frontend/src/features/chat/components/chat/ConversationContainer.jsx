import React from 'react';
import useConversation from "@/zustand/useConversation";
import ChatHeader from "./ChatHeader";
import MessageContainer from "./MessageContainer";
import { MessageSquare } from 'lucide-react';

const ConversationContainer = () => {
  const { selectedConversation } = useConversation();

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
        <MessageSquare size={64} className="text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Nenhuma conversa selecionada</h2>
        <p className="text-gray-500">Selecione uma conversa para começar a enviar mensagens</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader />
      <MessageContainer />
    </div>
  );
};

export default ConversationContainer;