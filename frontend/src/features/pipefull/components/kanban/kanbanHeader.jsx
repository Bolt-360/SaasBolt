import { Button } from "@/components/ui/button";
import { CircleCheckIcon, CircleDashedIcon, CircleDotDashedIcon, CircleDotIcon, CircleIcon, Plus, PlusIcon } from "lucide-react"

const statusIconMap = [
    {status: "Backlog", icon: <CircleDashedIcon className="size-[18px] text-pink-400"/>},
    {status: "A fazer", icon: <CircleIcon className="size-[18px] text-red-400"/>},
    {status: "Em andamento", icon: <CircleDotDashedIcon className="size-[18px] text-yellow-400"/>},
    {status: "Em revisão", icon: <CircleDotIcon className="size-[18px] text-blue-400"/>},
    {status: "Concluído", icon: <CircleCheckIcon className="size-[18px] text-emerald-400"/>}
]

export function KanbanHeader({status, taskCount}) {
    const statusIcon = statusIconMap.find(item => item.status === status)?.icon;
    return (
        <div className="px-2 py-1.5 flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                {statusIcon}
                <h2 className="text-sm font-medium">
                    {status}
                </h2>
                <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
                    {taskCount}
                </div>
            </div>
            <button className="size-5">
                <PlusIcon className="size-4 text-neutral-500" />
            </button>
        </div>
    )
}