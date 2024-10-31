'use client'

import React from 'react'
import { ListChecks, CircleUserRound, Folder, Calendar, ListFilter } from 'lucide-react'
import { usePage } from './TasksContext';
import { TableTasks } from '../components/TableTasks';
import { TasksProvider } from './TasksContext';
import { DataKanban } from '../components/kanban/dataKanban';
import Calendario from '../components/calendario/Calendario';
import ModalTasks from '../components/ModalTasks';
import { Tabs } from '@/components/ui/tabs';
import { Filters } from './Filters';

function MyTasksContent() {
    const { pageState, activeButton, setTable, setKanban, setCalendar, tableData, members, taskStatus  } = usePage();
    
    return (
        <div className="flex-1 w-full h-full bg-white">
            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <h2 className="text-2xl font-bold mb-6">Minhas Tasks</h2>
                    
                    {/* Estatísticas Gerais */}
                    <div className='border rounded-md bg-white overflow-auto '>
                        <div className="flex flex-col items-center gap-6 mb-1  p-3 lg:flex-row">
                            <Tabs className={`border rounded-md px-2 py-1 hover:bg-blue-600 hover:text-white cursor-pointer ${activeButton === 'table' ? 'bg-blue-600 text-white' : 'bg-white'}`} 
                            onClick={setTable}>
                                Tabela
                            </Tabs>

                            <Tabs className={`border rounded-md px-2 py-1 hover:bg-blue-600 hover:text-white cursor-pointer ${activeButton === 'kanban' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                            onClick={setKanban}>
                                Kandan
                            </Tabs>
                            
                            <Tabs className={`border rounded-md px-2 py-1 hover:bg-blue-600 hover:text-white cursor-pointer ${activeButton === 'calendar' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                            onClick={setCalendar}>
                                Calendário
                            </Tabs>

                            <ModalTasks/>
                        </div>
                        <hr className='mb-2'/>

                        <div className='flex gap-6 mb-1 p-3'>
                            <Filters 
                            taskStatus={taskStatus} 
                            members={members}
                            data={tableData}
                            /> 
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