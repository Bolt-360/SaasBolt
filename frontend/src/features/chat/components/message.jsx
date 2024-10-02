import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function Message({ text, timestamp, isUser, hasImage, avatarSrc }) {
  return (
    <div className={`chat ${isUser ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <Avatar>
            <AvatarImage src={avatarSrc || "/placeholder-user.jpg"} alt="User" />
            <AvatarFallback>{isUser ? "U" : "A"}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className={`chat-bubble ${isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
        <p>{text}</p>
        {hasImage && (
          <img
            src="/placeholder.svg"
            alt="Image"
            className="mt-2 rounded-md"
            width="200"
            height="200"
            style={{ aspectRatio: "1", objectFit: "cover" }}
          />
        )}
      </div>
      <div className="chat-footer opacity-50 text-xs">{timestamp}</div>
    </div>
  );
}
