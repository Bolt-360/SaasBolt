import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const StatusIndicator = ({ status }) => {
  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    offline: "bg-gray-500"
  };

  return (
    <span className={cn(
      "absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white",
      statusColors[status] || statusColors.offline
    )} />
  );
};

const ConversationItem = ({ name, lastMessage, time, avatarSrc, isSelected, onClick, status = "online" }) => {
  return (
    <div 
      className={cn(
        "flex items-center space-x-4 p-3 rounded-lg cursor-pointer hover:bg-secondary",
        isSelected && "bg-secondary"
      )}
      onClick={onClick}
    >
      <div className="relative">
        <Avatar>
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <StatusIndicator status={status} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        {lastMessage && (
          <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
        )}
      </div>
      {time && (
        <span className="text-xs text-gray-400">{time}</span>
      )}
    </div>
  );
};

export default ConversationItem;