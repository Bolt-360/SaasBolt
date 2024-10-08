import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationItem from "./conversationItem";
import useGetContacts from "@/hooks/useGetContacts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useConversation from "@/zustand/useConversation";
import useGetListConversations from '@/hooks/useGetListConversations';
import { useAuthContext } from "@/context/AuthContext";

export default function Sidebar({ activeTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const { loading: loadingConversations, conversations } = useGetListConversations();
  const { loading: loadingContacts, contacts } = useGetContacts();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { authUser } = useAuthContext();

  const filteredConversations = conversations.filter(conv => 
    conv.otherParticipant?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact => 
    contact.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectConversation = (conversation) => {
    const statuses = ['online', 'away', 'busy', 'offline'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setSelectedConversation({...conversation, status: randomStatus});
  };

  return (
    <div className="w-1/4 flex flex-col border-r h-full bg-background">
      <div className="p-4">
        <h1 className="text-xl font-bold">{activeTab === 'conversations' ? 'Conversas' : 'Contatos'}</h1>
        <div className="mt-4">
          <Input 
            type="search" 
            placeholder="Pesquisar" 
            className="w-full" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {activeTab === 'conversations' && (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="unread">Não lidas</TabsTrigger>
            <TabsTrigger value="groups">Grupos</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-4 p-4">
                {loadingConversations ? (
                  <div>Carregando conversas...</div>
                ) : filteredConversations.length === 0 ? (
                  <div>Nenhuma conversa encontrada.</div>
                ) : (
                  filteredConversations.map((conversation) => {
                    return (
                      <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        isSelected={selectedConversation?.id === conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                      />
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="unread">
            {/* Conteúdo para conversas não lidas */}
          </TabsContent>
          <TabsContent value="groups">
            {/* Conteúdo para grupos */}
          </TabsContent>
        </Tabs>
      )}
      {activeTab === 'contacts' && (
        <ScrollArea className="flex-1">
          <div className="space-y-4 p-4">
            {loadingContacts ? (
              <div>Carregando contatos...</div>
            ) : filteredContacts.length === 0 ? (
              <div>Nenhum contato encontrado.</div>
            ) : (
              filteredContacts.map((contact) => (
                <ConversationItem
                  key={contact.id}
                  conversation={{
                    otherParticipant: contact,
                    lastMessage: null
                  }}
                  isSelected={selectedConversation?.id === contact.id}
                  onClick={() => handleSelectConversation({
                    id: contact.id,
                    otherParticipant: contact
                  })}
                />
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
