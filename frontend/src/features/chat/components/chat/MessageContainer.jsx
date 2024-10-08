import React, { useEffect, useRef } from 'react';
import Message from "../Message";
import ChatInput from "./chatInput";
import ChatHeader from "./chatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetMessages from '@/hooks/useGetMessages';
import useConversation from "@/zustand/useConversation";
import { MessageSquare } from 'lucide-react';

const MessageContainer = () => {
    const { messages, getMessages, addMessage } = useGetMessages();
    const { selectedConversation } = useConversation();
    const scrollAreaRef = useRef(null);
    
    useEffect(() => {
        if (selectedConversation?.otherParticipant?.id) {
            getMessages();
        }
    }, [selectedConversation, getMessages]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

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
        <div className='flex-1 flex flex-col'>
            <ChatHeader />
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-4">
                    {!Array.isArray(messages) || messages.length === 0 ? (
                        <p className='text-center text-muted-foreground font-small'>
                            Inicie uma conversa enviando uma mensagem
                        </p>
                    ) : (
                        messages.map((message) => (
                            <Message key={message.id.toString()} message={message} />
                        ))
                    )}
                </div>
            </ScrollArea>
            <ChatInput addMessage={addMessage} />
        </div>
    );
};

export default MessageContainer;