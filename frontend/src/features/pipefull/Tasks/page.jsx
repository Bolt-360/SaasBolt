'use client'

import React from 'react'
import { ListChecks, CircleUserRound, Folder, Calendar, ListFilter } from 'lucide-react'
import { usePage } from './TasksContext';
import { TableTasks } from '../components/TableTasks';
import { TasksProvider } from './TasksContext';
import { DataKanban } from '../components/kanban/dataKanban';
import Calendario from '../components/calendario';
import ModalTasks from '../components/ModalTasks';
import { Tabs } from '@/components/ui/tabs';

function MyTasksContent() {
    const { pageState, activeButton, setTable, setKanban, setCalendar, tableData, addTask, removeTask, updateTask, updateTaskStatus  } = usePage();
    
    return (
        <div className="flex h-screen bg-white">
        {/* Sidebar */}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            <h2 className="text-2xl font-bold mb-6">Minhas Tasks</h2>
            
            {/* Estatísticas Gerais */}
            <div className='border rounded-md bg-white'>
                <div className="flex items-center gap-6 mb-1  p-3 ">
                    <Tabs className={`border rounded-md px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer ${activeButton === 'table' ? 'bg-blue-500 text-white' : 'bg-white'}`} 
                    onClick={setTable}>
                        Tabela
                    </Tabs>

                    <Tabs className={`border rounded-md px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer ${activeButton === 'kanban' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    onClick={setKanban}>
                        Kandan
                    </Tabs>
                    
                    <Tabs className={`border rounded-md px-2 py-1 hover:bg-blue-500 hover:text-white cursor-pointer ${activeButton === 'calendar' ? 'bg-blue-500 text-white' : 'bg-white'}`}
                    onClick={setCalendar}>
                        Calendário
                    </Tabs>

                    <ModalTasks />
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
                    {pageState === "table" && (<TableTasks dataTable={tableData} />)}
                    {pageState === "kanban" && (<DataKanban dataTable={tableData} />)}
                    {pageState === "calendar" && (<Calendario dataTable={tableData}/>)}
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