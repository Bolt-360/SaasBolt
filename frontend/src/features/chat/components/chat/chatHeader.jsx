import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { SettingsIcon, VideoIcon, OptionIcon } from "lucide-react";

export default function ChatHeader() {
    return(
        <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">+55 84 8107-4090</p>
          <p className="text-sm text-muted-foreground">Conta comercial</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <SettingsIcon className="w-6 h-6" />
        <VideoIcon className="w-6 h-6" />
        <OptionIcon className="w-6 h-6" />
            </div>
        </div>
    )
}