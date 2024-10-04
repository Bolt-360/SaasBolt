import React, { useState } from 'react';
import Sidebar from "@/features/chat/components/sidebar";
import ConversationContainer from "@/features/chat/components/chat/ConversationContainer"
import imagemdeFundo from "@/assets/bg.jpg";
import IconSidebar from "@/features/chat/components/IconSidebar";
import useConversation from "@/zustand/useConversation";

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('conversations');
  const { selectedConversation } = useConversation();

  return (
    <div
      className="min-h-screen bg-cover flex items-center justify-center p-4 pb-20"
      style={{
        backgroundImage: `url(${imagemdeFundo})`,
        backgroundRepeat: 'repeat', // Faz a imagem repetir
        backgroundSize: 'auto', // Define o tamanho da imagem como auto
        backgroundPosition: 'center', // Centraliza a imagem
      }}
    >
      <div className="bg-background rounded-lg shadow-xl w-full max-w-[90vw] h-[85vh] flex overflow-hidden">
        <IconSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <Sidebar activeTab={activeTab} />
        <ConversationContainer selectedConversation={selectedConversation} />
      </div>
    </div>
  );
}
