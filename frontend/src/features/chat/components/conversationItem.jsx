import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from '@/utils/formatTime';

const ConversationItem = ({ conversation, isSelected, onClick }) => {
  const { otherParticipant, lastMessage } = conversation;

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div 
      className={`flex items-center space-x-4 p-3 hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-gray-200' : ''}`}
      onClick={onClick}
    >
      <Avatar>
        {otherParticipant.profilePicture ? (
          <AvatarImage src={otherParticipant.profilePicture} alt={otherParticipant.username || 'User'} />
        ) : (
          <AvatarFallback>{getInitials(otherParticipant.username)}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {otherParticipant.username || 'Usuário desconhecido'}
        </p>
        {lastMessage && (
          <p className="text-sm text-gray-500 truncate">
            {lastMessage.content}
          </p>
        )}
      </div>
      {lastMessage && lastMessage.createdAt && (
        <span className="text-xs text-gray-400">
          {formatTime(lastMessage.createdAt)}
        </span>
      )}
    </div>
  );
};

export default ConversationItem;