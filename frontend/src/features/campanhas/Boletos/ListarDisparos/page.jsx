"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MoreVertical, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";


export default function ListarDisparos() {
  const navigate = useNavigate();
  const [indexDropMenu, setIndexDropMenu] = useState(null);
  const dataTable = [
    {label: "2 dias antes", proxEnvio: "05/11", ultEnvio: "05/12"},
    {label: "5 dias antes", proxEnvio: "05/11", ultEnvio: "05/12"}
  ]
  const itens = [
    {label: 'Editar'},
    {label: 'Ativar'},
    {label: 'Excluir'}
  ]

  const handleOpenDropMenu = (index) => {
    setIndexDropMenu(prevIndex => prevIndex === index ? null : index);
  }

  return (
    <div className="h-screen overflow-hidden">
      <main className="h-full overflow-y-auto">
        <div className="max-w-[1200px] pb-[60px] mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Disparos</h1>
            <Button 
            onClick={() => navigate('/app/campanhas/criar-disparo')}
            className="flex items-center gap-2"
            >
              <Plus size={16} />
              Novo Disparo
            </Button>
          </div>
          <div className="flex items-center justify-center border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Disparo</TableHead>
                  <TableHead>Último Envio</TableHead>
                  <TableHead>Próximo Envio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataTable.map((data, index) => (
                  <TableRow key={data.label}>
                    <TableCell className="font-medium">{data.label}</TableCell>
                    <TableCell>{data.ultEnvio}</TableCell>
                    <TableCell>{data.proxEnvio}</TableCell>
                    <TableCell>
                      <DropdownMenu open={indexDropMenu === index} onOpenChange={() => handleOpenDropMenu(index)}>
                        <DropdownMenuTrigger asChild>
                          <MoreVertical className="w-4 h-4 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {itens.map((item, index) => (
                            <DropdownMenuItem key={index}>
                              {item.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}
