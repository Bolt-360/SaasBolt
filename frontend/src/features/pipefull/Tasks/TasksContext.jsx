import React, { createContext, useState, useContext, useEffect } from 'react';

// dados que serão utilizados na tabela
let id = 1;
const dataTable = [
    { id: id++, task: 'Prototipação', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Backlog", dueDate: new Date()},
];

const taskStatus = ["Backlog", "A fazer", "Em andamento", "Em revisão", "Concluído"];

const members = [
    { name: 'Lucas', email: 'lucas@bolt360.com.br', funcao: 'TechLead' },
    { name: 'Matheus', email: 'matheus@bolt360.com.br', funcao: 'Estagiário' },
    { name: 'Victor', email: 'victor@bolt360.com.br', funcao: 'Desenvolvedor' },
    { name: 'Michael', email: 'michael@bolt360.com.br', funcao: 'Estagiário' }
];

// Criação do contexto
const TasksContext = createContext(undefined);

export const TasksProvider = ({ children }) => {
    // Estado para gerenciamento de páginas e botões ativos
    const [pageState, setPageState] = useState("table"); 
    const [activeButton, setActiveButton] = useState("table");
    
    const [tableData, setTableData] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");
        return savedTasks ? JSON.parse(savedTasks) : dataTable;
    });
    
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tableData));
    }, [tableData]);

    const setTable = () => {
        setPageState("table");
        setActiveButton("table");
    };
    
    const setKanban = () => {   
        setPageState("kanban");
        setActiveButton("kanban");
    };
    
    const setCalendar = () => {
        setPageState("calendar");
        setActiveButton("calendar");
    };

    const addTask = (newTask) => {
        newTask.id = id++;
        setTableData(prev => {
            const updatedData = [...prev, newTask];
            localStorage.setItem("tasks", JSON.stringify(updatedData)); 
            return updatedData;
        });
    };

    const removeTask = (taskId) => {
        setTableData(prev => {
            const updatedData = prev.filter(task => task.id !== taskId);
            localStorage.removeItem("tasks", JSON.stringify(updatedData)); 
            return updatedData;
        });
    };

    const updateTask = (taskId, updatedTask) => {
        setTableData(prev => {
            const updatedData = prev.map(task => 
                task.id === taskId ? { ...task, ...updatedTask } : task
            );
            localStorage.setItem("tasks", JSON.stringify(updatedData)); 
            return updatedData;
        });
    };

    const updateTaskStatus = (taskId, newStatus) => {
        setTableData(prev => {
            const updatedData = prev.map(task => 
                task.id === taskId ? { ...task, status: newStatus } : task
            );
            localStorage.setItem("tasks", JSON.stringify(updatedData)); 
            return updatedData;
        });
    };

    return (
        <TasksContext.Provider value={{ 
            pageState, 
            activeButton, 
            tableData, 
            setTable, 
            setKanban, 
            setCalendar,
            addTask,
            removeTask,
            updateTask,
            updateTaskStatus,
            taskStatus,
            members, 
        }}>
            {children}
        </TasksContext.Provider>
    );
};

// Hook para acessar o contexto
export const usePage = () => {
    const context = useContext(TasksContext);
    if (context === undefined) {
        throw new Error('usePage deve ser usado dentro de um PageProvider');
    }
    return context;
};
