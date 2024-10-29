import React, { createContext, useState, useContext } from 'react';


// dados que serão utilizados na tabela
let id = 1;
const dataTable = [
    { id: id++, task: 'Prototipação', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Backlog" },
    { id: id++, task: 'Layout', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Em andamento" },
    { id: id++, task: 'Teste', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "Concluído" },
    { id: id++, task: 'Estudos', projeto: "AppBolt", responsavel: "Estagiários", data: new Date(), status: "A fazer" }
]

const taskStatus = ["Backlog", "A fazer", "Em andamento", "Em revisão", "Concluído" ]

const members = [
    {name: 'Lucas', email: 'lucas@bolt360.com.br', funcao: 'TechLead'},
    {name: 'Matheus', email:'matheus@bolt360.com.br', funcao: 'Estagiário'},
    {name: 'Victor', email: 'victor@bolt360.com.br', funcao: 'Desenvolvedor'},
    {name: 'Michael', email:'michael@bolt360.com.br', funcao: 'Estagiário'}
]

// Crie o contexto
const TasksContext = createContext(undefined);

export const TasksProvider = ({ children }) => {
    // Estado que armazena qual botão foi clicado
    const [pageState, setPageState] = useState("table"); // "home" é o estado inicial
    const [activeButton, setActiveButton] = useState("table");
    const [tableData, setTableData] = useState(dataTable); // Adicionando os dados ao estado

    // navegação da página
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

    // funções para manipular os dados
    const addTask = (newTask) => {
        newTask.id = id++; // Atribui o próximo ID e o incrementa
        setTableData(prev => [...prev, newTask]);
    };

    // Remove uma tarefa pelo ID
    const removeTask = (taskId) => {
        setTableData(prev => prev.filter(task => task.id !== taskId));
    };

    // Atualiza uma tarefa pelo ID
    const updateTask = (taskId, updatedTask) => {
        setTableData(prev => prev.map(task => 
            task.id === taskId ? { ...task, ...updatedTask } : task
        ));
    };

    // Atualiza apenas o status de uma tarefa pelo ID
    const updateTaskStatus = (taskId, newStatus) => {
        setTableData(prev => prev.map(task => 
            task.id === taskId ? { ...task, status: newStatus } : task
        ));
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
        }}
    >
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
