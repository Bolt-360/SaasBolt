import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { KanbanHeader } from "./kanbanHeader";
import { KanbanCard } from "./kanbanCard";
import { usePage } from "../../Tasks/TasksContext";

export function DataKanban({ dataTable }) {
    const [tasks, setTasks] = useState([]);
    const { taskStatus } = usePage();

    // Efeito para sincronizar com dataTable
    useEffect(() => {
        if (dataTable) {
            // Garante que não há duplicatas usando um Map com o ID como chave
            const uniqueTasks = new Map();
            dataTable.forEach(task => {
                uniqueTasks.set(task.id, task);
            });
            setTasks(Array.from(uniqueTasks.values()));
        }
    }, [dataTable]);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return;

        const updatedTasks = Array.from(tasks);

        if (source.droppableId === destination.droppableId) {
            // Reordenação na mesma coluna
            const [movedTask] = updatedTasks.splice(source.index, 1);
            updatedTasks.splice(destination.index, 0, movedTask);
        } else {
            // Movendo entre colunas
            const taskIndex = updatedTasks.findIndex(
                task => String(task.id) === result.draggableId
            );
            if (taskIndex !== -1) {
                updatedTasks[taskIndex] = {
                    ...updatedTasks[taskIndex],
                    status: destination.droppableId
                };
            }
        }

        setTasks(updatedTasks);
    };

    // Memoize as tarefas filtradas para cada status
    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto gap-4 p-4">
                {taskStatus.map((status) => {
                    const statusTasks = getTasksByStatus(status);
                    return (
                        <div 
                            key={status} 
                            className="flex-1 bg-muted p-4 rounded-lg min-w-[300px] max-w-[350px]"
                        >
                            <KanbanHeader 
                                status={status} 
                                taskCount={statusTasks.length} 
                            />
                            <Droppable droppableId={status}>
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="min-h-[200px] mt-4 space-y-4"
                                    >
                                        {statusTasks.map((task, index) => (
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
                                                        <KanbanCard task={task} />
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