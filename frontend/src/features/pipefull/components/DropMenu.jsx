import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVerticalIcon } from "lucide-react"

export default function DropMenu( {update, remove} ) {
    return (
        <DropdownMenu className="border-none">
            <DropdownMenuTrigger>
                <MoreVerticalIcon className="size-4"/>
            </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onclick={update}>Editar Task</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onclick={remove}>Deletar Task</DropdownMenuItem>
                </DropdownMenuContent>
        </DropdownMenu>
    )
}