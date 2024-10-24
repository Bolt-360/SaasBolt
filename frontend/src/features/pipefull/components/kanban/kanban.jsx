import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useCallback, useEffect, useState } from "react";
import { KanbanHeader } from "./kanbanHeader";

const TaskStatus = ["BACKLOG", "TO_DO", "IN_PROGRESS", "IN_REVIEW", "DONE"  ]

const taskData = [
    { id: 1, name: "Task 1", status: "BACKLOG" },
    { id: 2, name: "Task 2", status: "TO_DO" },
    { id: 3, name: "Task 3", status: "IN_PROGRESS" },
    // Adicione mais tarefas conforme necessário
];

export function DataKanban( ) {
    const [tasks, setTasks] = useState(() => {
        const initialTasks = {
            BACKLOG: [],
            TO_DO: [],
            IN_PROGRESS: [],
            IN_REVIEW: [],
            DONE: [],
        }

        // taskData.forEach(task => {
        //     initialTasks[task.status].push(task)
        // });

        return initialTasks;
    });

    // const onDragEnd = (result) => {
    //     const { destination, source, draggableId } = result;
    
    //     // Verificar se o destino é válido
    //     if (!destination) {
    //         return;
    //     }
    
    //     // Adicionar lógica para reorganizar tarefas
    //     if (destination.droppableId === source.droppableId && destination.index === source.index) {
    //         return;
    //     }
    // }

    return (
        <DragDropContext>
            <div className="flex overflow-x-auto">
                {TaskStatus.map((status, index) => (
                    <div className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]">
                        <KanbanHeader key={index} status={status}/>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
}

{/* <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex overflow-x-auto">
                {status.map((status) => (
                    <Droppable key={status} droppableId={status}>
                        {(provided) => (
                            <div
                                className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <KanbanHeader status={status} />
                                {tasks[status].map((task, index) => (
                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="task-item"
                                            >
                                                {task.name}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                ))}
            </div>
        </DragDropContext> */}