import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"
import EditTaskModal from "./EditTaskModal";

export default function DropMenu( {update, remove, data} ) {
    const [showModal, setShowModal] = useState(false);

    const handleEditClick = () => {
        setShowModal(true);
    };
    return (
        <>
            <DropdownMenu className="border-none">
                <DropdownMenuTrigger>
                    <MoreVerticalIcon className="size-4"/>
                </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem className="cursor-pointer" onClick={handleEditClick}>Editar Task</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer" onClick={remove}>Deletar Task</DropdownMenuItem>
                    </DropdownMenuContent>
            </DropdownMenu>

            {showModal && (
                <EditTaskModal 
                    data={data}
                    onClose={() => setShowModal(false)}
                    update={update}
                />
            )}
        </>
    )
}