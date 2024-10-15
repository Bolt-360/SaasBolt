import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import FormattedMessage from "@/components/FormattedMessage";

const ConversationItem = ({ conversation, isSelected, onClick }) => {
  // Verifica se conversation e otherParticipant existem
  if (!conversation || !conversation.otherParticipant) {
    return null; // ou você pode retornar um componente de fallback
  }

  const { otherParticipant, lastMessage, status } = conversation;

  const truncate = (str, length) => {
    if (str.length <= length) return str;
    return str.slice(0, length) + '...';
  };

  return (
    <div
      className={cn(
        "grid grid-cols-[auto,1fr,auto] gap-2 p-2 hover:bg-accent rounded-lg cursor-pointer items-center",
        isSelected && "bg-accent"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="w-10 h-10">
          <AvatarImage src={otherParticipant.profilePicture} alt={otherParticipant.username} />
          <AvatarFallback>{otherParticipant.username[0]}</AvatarFallback>
        </Avatar>
        {status && (
          <span 
            className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
              status === 'online' ? 'bg-green-500' : 'bg-gray-300'
            )}
          />
        )}
      </div>
      <div className="min-w-0 overflow-hidden">
        <p className="text-sm font-medium text-gray-900 truncate">
          {conversation.name || otherParticipant.username}
        </p>
        {lastMessage && (
          <p className="text-xs text-gray-500 truncate">
            <FormattedMessage content={lastMessage.content} />
          </p>
        )}
      </div>
      {lastMessage && (
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
};

export default ConversationItem;
