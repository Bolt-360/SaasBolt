import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const dataTable = [
    { task: 'Prototipação', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Building" },
    { task: 'Layout', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Building" },
    { task: 'Teste', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Building" },
    { task: 'Estudos', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Building" }
]
export function TableTasks() {
    return(
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
                        <TableRow 
                        key={data.task}
                        className=""
                        >
                            <TableCell>{data.task}</TableCell>
                            <TableCell>{data.projeto}</TableCell>
                            <TableCell>{data.responsavel}</TableCell>
                            <TableCell>{data.data.toLocaleDateString()}</TableCell>
                            <TableCell><span className="bg-blue-400 rounded-lg p-1">{data.status}</span></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}