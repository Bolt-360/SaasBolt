'use client'

import React from 'react'
import { useState } from 'react'
import { Plus, ListChecks, CircleUserRound, Folder, Calendar, ListFilter } from 'lucide-react'
import { usePage } from './TasksContext';
import { TableTasks } from '../components/TableTasks';
import { TasksProvider } from './TasksContext';
import { DataKanban } from '../components/kanban/kanban';


// Dados simulados para os gráficos
const dataTable = [
    { task: 'Prototipação', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Protótipo" },
    { task: 'Prototipação', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Protótipo" },
    { task: 'Prototipação', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Protótipo" },
    { task: 'Prototipação', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Protótipo" }
]


function MyTasksContent() {
    const { pageState, setTable, setKanban, setCalendar } = usePage();
    
    const [ active, setActive ] = useState(false);
    const handleButtonClick = () => {
        setActive(true)
    }
    
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
                    <button 
                    className={`border rounded-md px-2 py-1 hover:bg-gray-300 cursor-pointer ${active ? 'bg-gray-300' : ''}`} 
                    onClick={setTable}
                    >
                        Tabela
                    </button>
                    <button 
                    className={`border rounded-md px-2 py-1 hover:bg-gray-300 cursor-pointer ${active ? 'bg-gray-300' : ''}`}
                    onClick={setKanban}
                    >
                        Kanban
                    </button>
                    <span className='border rounded-md px-2 py-1 hover:bg-gray-300 cursor-pointer'>
                        <a onClick={setCalendar}>Calendário</a>
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

                {/* Deixar div responsiva */}
                <div> 
                    {pageState === "table" && (<TableTasks/>)}
                    {pageState === "kanban" && (<DataKanban/>)}
                    {pageState === "calendar" && <div>Visualização do Calendário</div>}
                </div>
            </div>
            </main>
        </div>
        </div>
    )
}

export default function MyTasks() {
    return (
        <TasksProvider>
            <MyTasksContent />
        </TasksProvider>
    );
}