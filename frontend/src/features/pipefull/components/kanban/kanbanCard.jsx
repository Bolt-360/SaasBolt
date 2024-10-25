import { MoreHorizontal } from "lucide-react";

export function KanbanCard({ tasks }) {
    if(tasks == null || tasks == undefined) return null;
    return(
        <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-x-2">
                <p className="text-sm line-clamp-2">{tasks}</p>
                {/* <TaskAction>
                    <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition"/>
                </TaskAction> */}
            </div>
        </div>
    )
}