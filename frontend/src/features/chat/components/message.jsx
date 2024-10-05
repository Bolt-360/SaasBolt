import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/AuthContext";
import useConversation from "@/zustand/useConversation";
import { formatTime } from "@/utils/formatTime";

export function Message({ message }) {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  // Verifica se a mensagem foi enviada pelo usuário autenticado
  const messageFromMe = message.senderId === authUser?._id;

  // Define classes para o alinhamento e estilo da bolha de mensagem
  const chatClassName = messageFromMe ? "chat-end" : "chat-start"; // Alinhamento no lado direito para mensagens do usuário
  const bubbleClassName = messageFromMe ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"; // Cor primária para o usuário

  const profilePicture = messageFromMe ? authUser?.profilePicture : selectedConversation?.profilePicture;

  // Definir iniciais para fallback do Avatar
  const authInitials = authUser ? `${authUser.firstName?.charAt(0)}${authUser.lastName?.charAt(0)}` : "A";
  const conversationInitials = selectedConversation
    ? `${selectedConversation.firstName?.charAt(0)}${selectedConversation.lastName?.charAt(0)}`
    : "C";

  // Função para formatar a hora de envio da mensagem


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
        <p className="text-sm">{message.text}</p>
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
