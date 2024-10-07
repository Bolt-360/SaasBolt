import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useConversation from "@/zustand/useConversation";

const ChatHeader = () => {
  const { selectedConversation } = useConversation();
  const otherUser = selectedConversation?.otherParticipant;

  const getInitials = (user) => {
    const firstNameInitial = user?.firstName?.charAt(0) || "";
    const lastNameInitial = user?.lastName?.charAt(0) || "";
    return `${firstNameInitial}${lastNameInitial}` || "U";
  };

  return (
    <div className="bg-background border-b border-border p-4 flex items-center">
      <Avatar className="h-10 w-10 mr-3">
        <AvatarImage src={otherUser?.profilePicture} alt={otherUser?.username} />
        <AvatarFallback>{getInitials(otherUser)}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="font-semibold">{otherUser?.username}</h2>
        <p className="text-sm text-muted-foreground">{selectedConversation?.status || 'Offline'}</p>
      </div>
    </div>
  );
};

export default ChatHeader;