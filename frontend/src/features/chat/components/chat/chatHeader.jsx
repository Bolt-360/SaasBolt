import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreVertical, Phone, Video } from 'lucide-react';
import { cn } from "@/lib/utils";
import useConversation from "@/zustand/useConversation";

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

const ChatHeader = () => {
	const { selectedConversation } = useConversation();
	const statusText = {
		online: "Online",
		away: "Ausente",
		busy: "Ocupado",
		offline: "Offline"
	};

	if (!selectedConversation) {
		return (
			<div className="border-b p-4 flex items-center justify-between bg-background">
				<h2 className="text-xl font-semibold">Selecione uma conversa</h2>
			</div>
		);
	}

	return (
		<div className="border-b p-4 flex items-center justify-between bg-background">
			<div className="flex items-center space-x-4">
				<div className="relative">
					<Avatar>
						<AvatarImage src={selectedConversation.profilePicture} alt={selectedConversation.username} />
						<AvatarFallback>{selectedConversation.username[0]}</AvatarFallback>
					</Avatar>
					<StatusIndicator status={selectedConversation.status} />
				</div>
				<div>
					<h2 className="text-xl font-semibold">{selectedConversation.username}</h2>
					<p className="text-sm text-gray-500">{statusText[selectedConversation.status] || "Offline"}</p>
				</div>
			</div>
			<div className="flex items-center space-x-2">
				<button className="p-2 rounded-full hover:bg-gray-200">
					<Phone size={20} />
				</button>
				<button className="p-2 rounded-full hover:bg-gray-200">
					<Video size={20} />
				</button>
				<button className="p-2 rounded-full hover:bg-gray-200">
					<MoreVertical size={20} />
				</button>
			</div>
		</div>
	);
};

export default ChatHeader;