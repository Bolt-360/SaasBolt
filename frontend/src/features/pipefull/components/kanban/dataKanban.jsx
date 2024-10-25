import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { KanbanHeader } from "./kanbanHeader";
import { KanbanCard } from "./kanbanCard";

const TaskStatus = ["Backlog", "To Do", "In Progress", "In Review", "Done"  ]

const initialTasks = [
    { id: "1", content: "Prototipação de telas", status: "To Do"},
    { id: "2", content: "Rotas de renderização", status: "In Progress"},
    { id: "3", content: "Disparador", status: "In Progress"},
    { id: "4", content: "Site Passini", status: "In Review"}
];

export function DataKanban( ) {
    const [tasks, setTasks] = useState(initialTasks);

    const onDragEnd = (result) => {
        const { source, destination } = result;
    
        // Verifique se há um destino válido
        if (!destination) return;
    
        if (source.droppableId === destination.droppableId) {
            // Movendo dentro da mesma coluna
            const updatedTasks = tasks
                .filter((task) => task.status === source.droppableId);
            const [movedTask] = updatedTasks.splice(source.index, 1);
            updatedTasks.splice(destination.index, 0, movedTask);
            
            // Mesclando tarefas atualizadas com o estado geral
            const newTasks = tasks.map(task =>
                task.status === source.droppableId ? updatedTasks.shift() : task
            );
    
            setTasks(newTasks);
    
        } else {
            // Movendo para uma coluna diferente
            const updatedTasks = tasks.map((task) => {
                if (task.id === result.draggableId) {
                    return { ...task, status: destination.droppableId };
                }
                return task;
            });
            setTasks(updatedTasks);
        }
    };
    
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                {TaskStatus.map((status, index) => {
                    const taskCount = tasks.filter(task => task.status === status).length;
                    return (
                        <div className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px] mb-2">
                            <KanbanHeader key={index} status={status} taskCount={taskCount}/>
                            <Droppable droppableId={status}>
                                {provided => (
                                    <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="min-h-[200px] py-1.5"
                                    >
                                        {tasks
                                        .filter(task => task.status === status)
                                        .map((task, index) => {
                                            console.log("Task:", task.content); // Verifique se a tarefa está correta
                                            return (
                                                <Draggable 
                                                    key={task.id} 
                                                    draggableId={task.id} 
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <KanbanCard tasks={task.content} />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            );
                                        })}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                )})}
            </div>
        </DragDropContext>
    );
}

