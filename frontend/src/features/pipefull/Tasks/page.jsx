'use client'

import React from 'react'
import { useState } from 'react'    
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, ListChecks, CircleUserRound, Folder, Calendar, ListFilter } from 'lucide-react'


// Dados simulados para os gráficos
const dataTable = [
    { task: 'Prototipação', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Protótipo" },
    { task: 'Prototipação', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Protótipo" },
    { task: 'Prototipação', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Protótipo" },
    { task: 'Prototipação', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Protótipo" }
]

export default function MyTasks() {
    return (
        <div className="flex h-screen bg-white">
        {/* Sidebar */}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <h2 className="text-2xl font-bold mb-6">Minhas Tasks</h2>
            
            {/* Estatísticas Gerais */}
            <div className='border rounded-md bg-white'>
                <div className="flex items-center gap-6 mb-1  p-3">
                    <span className='border rounded-md px-2 py-1 hover:bg-gray-300 cursor-pointer'>
                        Tabela
                    </span>
                    <span className='border rounded-md px-2 py-1 hover:bg-gray-300 cursor-pointer'>
                        Kanban
                    </span>
                    <span className='border rounded-md px-2 py-1 hover:bg-gray-300 cursor-pointer'>
                        Calendário
                    </span>

                    <button className='flex gap-1 ml-auto mr-3 bg-blue-600 rounded-md text-white px-2 py-1'>
                        <Plus/>
                        New
                    </button>
                </div>
                <hr className='mb-2'/>

                <div className='flex gap-6 mb-1 p-3'>
                    <span className='flex gap-2 border rounded-md px-2'>
                        <ListChecks className='w-4'/>
                        Status
                        <ListFilter className='w-4 opacity-40'/>
                    </span>
                    <span className='flex gap-2 border rounded-md px-2'>
                        <CircleUserRound className='w-4'/>
                        Participantes
                        <ListFilter className='w-4 opacity-40'/>
                    </span>
                    <span className='flex gap-2 border rounded-md px-2'>
                        <Folder className='w-4'/>
                        Projetos
                        <ListFilter className='w-4 opacity-40'/>
                    </span>
                    <span className='flex gap-2 border rounded-md px-2'>
                        <Calendar className='w-4'/>
                        Data
                    </span>
                </div>
                <hr className='mb-2'/>

                <div>
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
                                <TableCell>{data.status}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
            </div>
            </main>
        </div>
        </div>
    )
}
