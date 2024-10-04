import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, LayoutDashboard, User, Settings, Menu, ChevronRight, LogOut, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate } from 'react-router-dom' // Aqui está o hook sendo importado
import { logoutcall } from '@/API/apicall-func'
import { toast } from 'sonner'

const initialColumns = {
    todo: {
        id: 'todo',
        title: 'A Fazer',
        tasks: [
            { id: 'task-1', content: 'Criar Plano de Projeto' },
            { id: 'task-2', content: 'Rascunhos de UI' },
        ],
    },
    inProgress: {
        id: 'inProgress',
        title: 'In Progress',
        tasks: [
            { id: 'task-3', content: 'Implementar..' },
        ],
    },
    done: {
        id: 'done',
        title: 'Done',
        tasks: [
            { id: 'task-4', content: 'Construir...' },
        ],
    },
}

export default function DashboardLayout() {
    const [columns, setColumns] = useState(initialColumns)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    
    
    // Hook useNavigate chamado diretamente dentro do componente de função
    const navigate = useNavigate();

    const handleLogout = async () => {
        console.log('Logging out...')
        const response = await signincall.logout();
        if(response.success){
            toast({
                title: "Logout realizado!",
                variant: "default",
              })
            navigate('/auth'); // Navegação após logout
        } else {
            toast({
                title: "Logout falhou!",
                variant: "destructive",
              })
            console.error('Logout failed');
        }
    }

    const onDragEnd = (result) => {
        const { source, destination } = result

        if (!destination) {
            return
        }

        if (source.droppableId === destination.droppableId) {
            const column = columns[source.droppableId]
            const newTasks = Array.from(column.tasks)
            const [reorderedItem] = newTasks.splice(source.index, 1)
            newTasks.splice(destination.index, 0, reorderedItem)

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    tasks: newTasks,
                },
            })
        } else {
            const sourceColumn = columns[source.droppableId]
            const destColumn = columns[destination.droppableId]
            const sourceTasks = Array.from(sourceColumn.tasks)
            const destTasks = Array.from(destColumn.tasks)
            const [movedItem] = sourceTasks.splice(source.index, 1)
            destTasks.splice(destination.index, 0, movedItem)

            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    tasks: sourceTasks,
                },
                [destination.droppableId]: {
                    ...destColumn,
                    tasks: destTasks,
                },
            })
        }
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-grey min-h-screen p-4 transition-all duration-300 ease-in-out flex flex-col",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="flex justify-between items-center mb-6">
                    {isSidebarOpen && <h2 className="text-2xl font-bold">Dashboard</h2>}
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        {isSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>
                <nav className="flex-1">
                    <ul className="space-y-2">
                        <li>
                            <Button variant="ghost" className={cn("w-full justify-start", !isSidebarOpen && "justify-center")}>
                                <LayoutDashboard className="h-4 w-4" />
                                {isSidebarOpen && <span className="ml-2">Kanban Board</span>}
                            </Button>
                        </li>
                        <li>
                            <Button variant="ghost" className={cn("w-full justify-start", !isSidebarOpen && "justify-center")}>
                                <User className="h-4 w-4" />
                                {isSidebarOpen && <span className="ml-2">Profile</span>}
                            </Button>
                        </li>
                        <li>
                            <Button variant="ghost" className={cn("w-full justify-start", !isSidebarOpen && "justify-center")}>
                                <Settings className="h-4 w-4" />
                                {isSidebarOpen && <span className="ml-2">Settings</span>}
                            </Button>
                        </li>
                    </ul>
                </nav>
                <Button variant="ghost" size="icon" onClick={handleLogout} className={cn("w-full flex-grow", !isSidebarOpen && "justify-center")}>
                    <LogOut className="h-4 w-4" />
                    {isSidebarOpen && <span className="ml-2">Log Out</span>}
                </Button>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-4 overflow-auto">
                <header className="bg-white shadow-md p-4 flex items-center mb-12">
                    <h1 className="text-2xl font-bold flex-grow text-center">Quadro Kanban</h1>
                </header>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex space-x-4 overflow-x-auto pb-4">
                        {Object.values(columns).map((column) => (
                            <div key={column.id} className="flex-shrink-0 w-72">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>{column.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Droppable droppableId={column.id}>
                                            {(provided) => (
                                                <div
                                                    {...provided.droppableProps}
                                                    ref={provided.innerRef}
                                                    className="min-h-[200px]"
                                                >
                                                    {column.tasks.map((task, index) => (
                                                        <Draggable key={task.id} draggableId={task.id} index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="bg-secondary p-2 mb-2 rounded shadow"
                                                                >
                                                                    {task.content}
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                        <Button variant="ghost" className="w-full mt-2">
                                            <PlusCircle className="mr-2 h-4 w-4" />
                                            Add Task
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </main>
        </div>
    )
}
