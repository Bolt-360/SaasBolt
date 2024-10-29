import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { KanbanHeader } from "./kanbanHeader";
import { KanbanCard } from "./kanbanCard";
import { usePage } from "../../Tasks/TasksContext";


export function DataKanban( {dataTable} ) {
    const [tasks, setTasks] = useState(dataTable || []);
    const { taskStatus } = usePage();

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
                {taskStatus.map((status, index) => {
                    const taskCount = tasks.filter(task => task.status === status).length;
                    return (
                        <div key={status} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px] mb-2">
                            <KanbanHeader status={status} taskCount={taskCount}/>
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
                                            console.log("Task:", task); // Verifique se a tarefa está correta
                                            return (
                                                <Draggable 
                                                    key={task.id} 
                                                    draggableId={String(task.id)} 
                                                    index={index}
                                                >
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <KanbanCard tasks={task} />
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

