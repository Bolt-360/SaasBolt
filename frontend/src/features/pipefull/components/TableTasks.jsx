import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVerticalIcon } from "lucide-react";
import { usePage } from "../Tasks/TasksContext";
import DropMenu from "./DropMenu";

export function TableTasks({ dataTable }) {
    const { removeTask, updateTask } = usePage();

    function getStatusClass(status) {
        switch (status) {
            case 'Backlog':
                return 'bg-pink-400';
            case "A fazer":
                return 'bg-red-400';
            case 'Em andamento':
                return 'bg-yellow-400';
            case 'Em revisão':
                return 'bg-blue-400';
            case 'Concluído':
                return 'bg-emerald-400';
            default:
                return 'bg-gray-400';
            }
        }

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="sticky top-0 bg-white">Tasks</TableHead>
                        <TableHead className="sticky top-0 bg-white">Projetos</TableHead>
                        <TableHead className="sticky top-0 bg-white">Responsável</TableHead>
                        <TableHead className="sticky top-0 bg-white">Data</TableHead>
                        <TableHead className="sticky top-0 bg-white">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {dataTable.map((data) => (
                        <TableRow key={data.id}>
                            <TableCell>{data.task}</TableCell>
                            <TableCell>{data.projeto}</TableCell>
                            <TableCell>{data.responsavel}</TableCell>
                            <TableCell>
                                {new Date(data.data).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                                <span className={`rounded-lg p-1 text-white ${getStatusClass(data.status)}`}>{data.status}</span>
                            </TableCell>
                            <TableCell>
                                <DropMenu data={data} update={updateTask} remove={() => removeTask(data.id)}/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
