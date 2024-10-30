import React, { createContext, useState, useContext, useEffect } from 'react';

// Criei essa função para o ID ser gerado basicamente usando um timestamp, evitando assim a duplicação dos ID'S.
const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// dados iniciais
const initialTasks = [
    { 
        id: generateUniqueId(), 
        task: 'Prototipação', 
        projeto: "AppBolt", 
        responsavel: "Estagiários", 
        data: new Date(), 
        status: "Backlog", 
        dueDate: new Date()
    },
];

const taskStatus = ["Backlog", "A fazer", "Em andamento", "Em revisão", "Concluído"];

const members = [
    { name: 'Lucas', email: 'lucas@bolt360.com.br', funcao: 'TechLead' },
    { name: 'Matheus', email: 'matheus@bolt360.com.br', funcao: 'Estagiário' },
    { name: 'Victor', email: 'victor@bolt360.com.br', funcao: 'Desenvolvedor' },
    { name: 'Michael', email: 'michael@bolt360.com.br', funcao: 'Estagiário' }
];

const TasksContext = createContext(undefined);

export const TasksProvider = ({ children }) => {
    const [pageState, setPageState] = useState("table");
    const [activeButton, setActiveButton] = useState("table");
    
    const [tableData, setTableData] = useState(() => {
        try {
            const savedTasks = localStorage.getItem("tasks");
            if (savedTasks) {
                const parsed = JSON.parse(savedTasks);
                // Espero que isso garanta que todas as tasks tem um ID único );
                return parsed.map(task => ({
                    ...task,
                    id: task.id || generateUniqueId()
                }));
            }
            return initialTasks;
        } catch (error) {
            console.error('Erro ao carregar tasks:', error);
            return initialTasks;
        }
    });
    
    useEffect(() => {
        try {
            localStorage.setItem('tasks', JSON.stringify(tableData));
        } catch (error) {
            console.error('Erro ao salvar tasks:', error);
        }
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
        const taskWithId = {
            ...newTask,
            id: generateUniqueId()
        };
        
        setTableData(prev => {
            const updatedData = [...prev, taskWithId];
            return updatedData;
        });
    };

    const removeTask = (taskId) => {
        setTableData(prev => {
            const updatedData = prev.filter(task => task.id !== taskId);
            return updatedData;
        });
    };

    const updateTask = (taskId, updatedTask) => {
        setTableData(prev => {
            const updatedData = prev.map(task => 
                task.id === taskId ? { ...task, ...updatedTask } : task
            );
            return updatedData;
        });
    };

    const updateTaskStatus = (taskId, newStatus) => {
        setTableData(prev => {
            const updatedData = prev.map(task => 
                task.id === taskId ? { ...task, status: newStatus } : task
            );
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

export const usePage = () => {
    const context = useContext(TasksContext);
    if (context === undefined) {
        throw new Error('usePage deve ser usado dentro de um PageProvider');
    }
    return context;
};