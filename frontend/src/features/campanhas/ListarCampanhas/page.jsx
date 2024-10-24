'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, User } from 'lucide-react'

// Dados simulados de campanhas
const campanhasData = [
  { id: 1, nome: "Promoção de Verão", status: "finalizada", mensagens: [
    { data: "2023-12-01 10:00", mensagem: "Aproveite nossa promoção de verão!", destinatario: "+55 11 98765-4321" },
    { data: "2023-12-01 10:05", mensagem: "50% de desconto em todos os produtos!", destinatario: "+55 11 98765-4322" },
  ]},
  { id: 2, nome: "Lançamento Produto X", status: "em_andamento", mensagens: [
    { data: "2023-12-05 09:00", mensagem: "Novo produto chegando!", destinatario: "+55 11 98765-4323" },
  ]},
  { id: 3, nome: "Black Friday", status: "a_iniciar", mensagens: [] },
]

const ListarCampanhas = () => {
  const [selectedCampanha, setSelectedCampanha] = useState(null)

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <Tabs defaultValue="todas" className="mb-6">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="finalizadas">Finalizadas</TabsTrigger>
            <TabsTrigger value="em_andamento">Em Andamento</TabsTrigger>
            <TabsTrigger value="a_iniciar">A Iniciar</TabsTrigger>
          </TabsList>
          <TabsContent value="todas">
            <CampanhasList campanhas={campanhasData} onSelect={setSelectedCampanha} />
          </TabsContent>
          <TabsContent value="finalizadas">
            <CampanhasList campanhas={campanhasData.filter(c => c.status === 'finalizada')} onSelect={setSelectedCampanha} />
          </TabsContent>
          <TabsContent value="em_andamento">
            <CampanhasList campanhas={campanhasData.filter(c => c.status === 'em_andamento')} onSelect={setSelectedCampanha} />
          </TabsContent>
          <TabsContent value="a_iniciar">
            <CampanhasList campanhas={campanhasData.filter(c => c.status === 'a_iniciar')} onSelect={setSelectedCampanha} />
          </TabsContent>
        </Tabs>

        {selectedCampanha && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedCampanha.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data de Envio</TableHead>
                    <TableHead>Mensagem</TableHead>
                    <TableHead>Destinatário</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedCampanha.mensagens.map((msg, index) => (
                    <TableRow key={index}>
                      <TableCell>{msg.data}</TableCell>
                      <TableCell>{msg.mensagem}</TableCell>
                      <TableCell>{msg.destinatario}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

const CampanhasList = ({ campanhas, onSelect }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {campanhas.map((campanha) => (
        <Card key={campanha.id} className="cursor-pointer" onClick={() => onSelect(campanha)}>
          <CardHeader>
            <CardTitle>{campanha.nome}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Status: {campanha.status}</p>
            <p>Mensagens: {campanha.mensagens.length}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default ListarCampanhas
