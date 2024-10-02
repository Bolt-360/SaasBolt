import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useState, useEffect, useRef } from "react";

export default function ConversationItem({ name, lastMessage, time }) {
    const [avatarSize, setAvatarSize] = useState(10);
    const [fontSize, setFontSize] = useState(14);
    const containerRef = useRef(null);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                if (width < 200) {
                    setAvatarSize(6);
                    setFontSize(10);
                } else if (width < 250) {
                    setAvatarSize(8);
                    setFontSize(12);
                } else {
                    setAvatarSize(10);
                    setFontSize(16);
                }
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="pl-2 flex items-center space-x-2 w-full p-1 hover:bg-accent cursor-pointer">
          <Avatar className={`flex-shrink-0 w-${avatarSize} h-${avatarSize}`}>
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0 overflow-hidden">
            <p style={{ fontSize: `${fontSize}px` }} className="font-medium truncate">{name}</p>
            <p style={{ fontSize: `${fontSize - 2}px` }} className="text-muted-foreground truncate">{lastMessage}</p>
          </div>
          <div style={{ fontSize: `${fontSize - 2}px` }} className="flex-shrink-0 text-muted-foreground ml-1 whitespace-nowrap pr-2">{time}</div>
        </div>
    );
}