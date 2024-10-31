import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FolderIcon, ListChecksIcon, UserIcon } from "lucide-react";

export function Filters( {taskStatus, members, data} ) {
    return(
        <div className="flex flex-col lg:flex-row gap-2">
            <Select
            defaultValue={undefined}
            onValueChange={() => {}}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <ListChecksIcon className="size-4 mr-2"/>
                        <SelectValue placeholder="Status"/> 
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Status</SelectItem>
                    <SelectSeparator />
                    {taskStatus.map((status) => (
                        <SelectItem value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
            defaultValue={undefined}
            onValueChange={() => {}}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <UserIcon className="size-4 mr-2"/>
                        <SelectValue placeholder="Responsável"/> 
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Responsável</SelectItem>
                    <SelectSeparator />
                    {members.map((member) => (
                        <SelectItem value={member}>{member.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
            defaultValue={undefined}
            onValueChange={() => {}}
            >
                <SelectTrigger className="w-full lg:w-auto h-8">
                    <div className="flex items-center pr-2">
                        <FolderIcon className="size-4 mr-2"/>
                        <SelectValue placeholder="Projetos"/> 
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Projetos</SelectItem>
                    <SelectSeparator />
                    {data.map((project) => (
                        <SelectItem value={project}>{project.projeto}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}