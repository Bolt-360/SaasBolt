import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState } from "react";
import { KanbanHeader } from "./kanbanHeader";
import { KanbanCard } from "./kanbanCard";
import { usePage } from "../../Tasks/TasksContext";

export function DataKanban({ dataTable }) {
    const [tasks, setTasks] = useState(dataTable || []);
    const { taskStatus } = usePage();

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return; // Se não houver destino, retorna

        // Se a tarefa foi movida dentro da mesma coluna
        if (source.droppableId === destination.droppableId) {
            const updatedTasks = Array.from(tasks); // Faz uma cópia do estado atual
            const [movedTask] = updatedTasks.splice(source.index, 1); // Remove a tarefa da posição original
            updatedTasks.splice(destination.index, 0, movedTask); // Insere a tarefa na nova posição
            setTasks(updatedTasks); // Atualiza o estado

        } else {
            // Se a tarefa foi movida para uma coluna diferente
            const updatedTasks = tasks.map((task) => {
                if (task.id === Number(result.draggableId)) { // Verifica se a tarefa foi movida
                    return { ...task, status: destination.droppableId }; // Atualiza o status da tarefa
                }
                return task;
            });
            setTasks(updatedTasks); // Atualiza o estado
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                {taskStatus.map((status) => {
                    const taskCount = tasks.filter(task => task.status === status).length;
                    console.log("Tasks for status:", status, tasks.filter(task => task.status === status)); // Debugging
                    return (
                        <div key={status} className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px] mb-2">
                            <KanbanHeader status={status} taskCount={taskCount} />
                            <Droppable droppableId={status}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="min-h-[200px] py-1.5"
                                    >
                                        {tasks
                                            .filter(task => task.status === status)
                                            .map((task, index) => (
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
                                                            <KanbanCard task={task} /> {/* Passa a tarefa corretamente */}
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    );
                })}
            </div>
        </DragDropContext>
    );
}
