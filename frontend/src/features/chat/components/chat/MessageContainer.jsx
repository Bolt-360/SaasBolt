import React, { useEffect, useRef } from 'react';
import Message from "../Message";
import ChatInput from "./chatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetMessages from '@/hooks/useGetMessages';

const MessageContainer = () => {
    const { messages, loading } = useGetMessages();
    const scrollAreaRef = useRef(null);
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    return (
        <>
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
                <div className="space-y-4">
                    {!loading && messages.length === 0 && (
                        <p className='text-center text-muted-foreground font-small'>
                            Inicie uma conversa enviando uma mensagem
                        </p>
                    )}
                    {!loading && messages.length > 0 && messages.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                </div>
            </ScrollArea>
            <ChatInput />
        </>
    );
};

export default MessageContainer;
