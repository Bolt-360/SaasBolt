import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { KanbanHeader } from "./kanbanHeader";
import { KanbanCard } from "./kanbanCard";
import { usePage } from "../../Tasks/TasksContext";

// Função para carregar e salvar tarefas no localStorage
const loadTasksFromStorage = () => JSON.parse(localStorage.getItem('tasks')) || [];
const saveTasksToStorage = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));

export function DataKanban({ dataTable }) {
    const [tasks, setTasks] = useState(dataTable || loadTasksFromStorage);
    const { taskStatus } = usePage();

    useEffect(() => {
        saveTasksToStorage(tasks);
    }, [tasks]);

    const onDragEnd = (result) => {
        const { source, destination } = result;

        if (!destination) return; 

        if (source.droppableId === destination.droppableId) {
            const updatedTasks = Array.from(tasks);
            const [movedTask] = updatedTasks.splice(source.index, 1);
            updatedTasks.splice(destination.index, 0, movedTask);
            setTasks(updatedTasks);

        } else {
            const updatedTasks = tasks.map((task) => {
                if (task.id === Number(result.draggableId)) {
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
                {taskStatus.map((status) => {
                    const taskCount = tasks.filter(task => task.status === status).length;
                    console.log("Tasks for status:", status, tasks.filter(task => task.status === status)); 
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