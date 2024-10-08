import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from '@/utils/formatTime';
import { useAuthContext } from "@/context/AuthContext";

const ConversationItem = ({ conversation, isSelected, onClick }) => {
  const { authUser } = useAuthContext();
  const { otherParticipant, lastMessage } = conversation;

  const getOtherParticipant = () => {
    if (otherParticipant.id === authUser.id) {
      const otherUserId = conversation.participants.find(id => id !== authUser.id);
      return {
        id: otherUserId,
        username: `User ${otherUserId}`,
        profilePicture: `https://avatar.iran.liara.run/public/boy?username=User ${otherUserId}`
      };
    }
    return otherParticipant;
  };

  const displayedParticipant = getOtherParticipant();

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const truncateMessage = (message, maxLength = 30) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength - 3) + '...';
  };

  return (
    <div 
      className={`flex items-center space-x-4 p-3 hover:bg-gray-100 cursor-pointer ${isSelected ? 'bg-gray-200' : ''}`}
      onClick={onClick}
    >
      <Avatar>
        {displayedParticipant.profilePicture ? (
          <AvatarImage src={displayedParticipant.profilePicture} alt={displayedParticipant.username || 'User'} />
        ) : (
          <AvatarFallback>{getInitials(displayedParticipant.username)}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {displayedParticipant.username || 'Usuário desconhecido'}
        </p>
        {lastMessage && (
          <p className="text-sm text-gray-500 truncate">
            {truncateMessage(lastMessage.content)}
          </p>
        )}
      </div>
      {lastMessage && lastMessage.createdAt && (
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {formatTime(lastMessage.createdAt)}
        </span>
      )}
    </div>
  );
};

export default ConversationItem;