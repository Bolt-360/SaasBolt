import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {cn} from "@/lib/utils" 

export function CardCalendario( {id, title, project, assignee, status} ) {
    const taskStatus = [
        {status: "Backlog", color: "border-l-pink-400"},
        {status: "A fazer", color: "border-l-red-400"},
        {status: "Em andamento", color: "border-l-yellow-400"},
        {status: "Em revisão", color: "border-l-blue-400"},
        {status: "Concluído", color: "border-l-emerald-400"},
    ];
    const statusColor = taskStatus.find(t => t.status === status)?.color;

    return(
        <div className="px-2">
            <div className={cn(
                "p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
                statusColor
            )}>
                <p>{title}</p>
                <div className="flex items-center gap-x-1">
                    <Avatar className="w-8 h-8">
                        <AvatarFallback>
                            {assignee[0]}
                        </AvatarFallback>
                    </Avatar>
                    
                    <div>
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-black text-white">
                            {project[0]}
                        </AvatarFallback>
                    </Avatar>
                    </div>
                </div>
            </div>
        </div>
    )
}