'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreVertical, Plus, Search } from 'lucide-react'

// Sample data
const campaigns = [
  { id: 1, name: "Summer Sale", sendDate: "2023-07-01", lastSent: "2023-06-15", status: "Inativo" },
  { id: 2, name: "Welcome Series", sendDate: "2023-06-20", lastSent: "2023-06-10", status: "Ativo" },
  { id: 3, name: "Product Launch", sendDate: "2023-08-01", lastSent: "Never", status: "Rascunho" },
  { id: 4, name: "Newsletter", sendDate: "2023-06-25", lastSent: "2023-06-18", status: "Inativo" },
  { id: 5, name: "Abandoned Cart", sendDate: "2023-06-22", lastSent: "2023-06-19", status: "Ativo" },
]

export default function ListarCampanhasDisparos() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (statusFilter === 'all' || campaign.status === statusFilter)
  )

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Campanhas</h1>
      <div className="flex justify-between items-center mb-6">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Criar Campanha
        </Button>
        <div className="relative w-1/3">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Procurar Campanhas"
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Inativo">Inativo</SelectItem>
            <SelectItem value="Rascunho">Rascunho</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Lista de Campanha</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data a Enviar</TableHead>
                <TableHead>Último Envio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Opções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell className="font-medium">{campaign.name}</TableCell>
                  <TableCell>{campaign.sendDate}</TableCell>
                  <TableCell>{campaign.lastSent}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

