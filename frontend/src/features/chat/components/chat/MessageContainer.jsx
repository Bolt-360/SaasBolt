import React from 'react';
import Message from "../Message";
import ChatInput from "./chatInput";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGetMessages from '@/hooks/useGetMessages';

const MessageContainer = () => {
    const { messages } = useGetMessages();
    console.log(messages);
    return (
        <>
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    <Message />
                    <Message />
                    <Message />
                    <Message />
                    <Message />
                    <Message />
                    <Message />
                </div>
            </ScrollArea>
            <ChatInput />
        </>
    )
}

export default MessageContainer;