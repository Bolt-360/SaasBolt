'use client'

import { useState } from 'react'
import Sidebar from '../components/Sidebar/Sidebar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, User, Menu, MoreHorizontal, QrCode, Power, Trash2 } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

// Dados simulados de instâncias
const instancesData = [
  { id: 1, name: "Suporte 1", number: "+55 11 98765-4321", status: "Conectado" },
  { id: 2, name: "Vendas", number: "+55 11 91234-5678", status: "Desconectado" },
  { id: 3, name: "Atendimento", number: "+55 11 99876-5432", status: "Conectado" },
  { id: 4, name: "Marketing", number: "+55 11 94321-8765", status: "Aguardando QR" },
]

export default function ListarInstancias() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getStatusBadge = (status) => {
    switch (status) {
      case "Conectado":
        return <Badge className="bg-green-500">Conectado</Badge>
      case "Desconectado":
        return <Badge className="bg-red-500">Desconectado</Badge>
      case "Aguardando QR":
        return <Badge className="bg-yellow-500">Aguardando QR</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  return (
    <div className="flex h-screen bg-white">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <h2 className="text-2xl font-bold mb-6">Listar Instâncias</h2>
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Instância</TableHead>
                  <TableHead>Número Conectado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instancesData.map((instance) => (
                  <TableRow key={instance.id}>
                    <TableCell className="font-medium">{instance.name}</TableCell>
                    <TableCell>{instance.number}</TableCell>
                    <TableCell>{getStatusBadge(instance.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <QrCode className="mr-2 h-4 w-4" />
                            <span>Gerar QR Code</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Power className="mr-2 h-4 w-4" />
                            <span>Desconectar</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Deletar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  )
}
