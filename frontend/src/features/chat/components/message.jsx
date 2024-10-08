import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/AuthContext";
import useConversation from "@/zustand/useConversation";
import { formatTime } from "@/utils/formatTime";

export function Message({ message }) {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  
  const messageFromMe = message.senderId === authUser?._id;
  const chatClassName = messageFromMe ? "chat-end" : "chat-start";
  const bubbleClassName = messageFromMe ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground";

  // Corrigido para usar a foto de perfil do outro usuário quando a mensagem não é do usuário autenticado
  const profilePicture = messageFromMe
    ? authUser?.profilePicture
    : selectedConversation?.otherParticipant?.profilePicture;

  const getInitials = (user) => {
    const firstNameInitial = user?.firstName?.charAt(0) || "";
    const lastNameInitial = user?.lastName?.charAt(0) || "";
    return `${firstNameInitial}${lastNameInitial}` || "U";
  };

  const authInitials = getInitials(authUser);
  // Corrigido para usar as iniciais do outro participante
  const conversationInitials = getInitials(selectedConversation?.otherParticipant);

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Avatar>
            <AvatarImage src={profilePicture || "/placeholder-user.jpg"} alt="User" />
            <AvatarFallback>
              {messageFromMe ? authInitials : conversationInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Bolha de mensagem com texto e imagem, se houver */}
      <div className={`chat-bubble ${bubbleClassName} ${message.hasImage ? "flex flex-col" : ""}`}>
        <p className="text-sm">{message.content}</p>
        {message.hasImage && (
          <img
            src={message.imageUrl}
            alt="Imagem"
            className="mt-2 rounded-md"
            width="200"
            height="200"
            style={{ aspectRatio: "1", objectFit: "cover" }}
          />
        )}
      </div>

      {/* Exibição do horário da mensagem */}
      <div className="chat-footer opacity-50 text-xs"> {formatTime(message.createdAt)}</div>
    </div>
  );
}

export default Message;
