import React, { createContext, useState, useContext } from 'react';

// Crie o contexto
const TasksContext = createContext(undefined);

export const TasksProvider = ({ children }) => {
  // Estado que armazena qual botão foi clicado
  const [pageState, setPageState] = useState("table"); // "home" é o estado inicial
    const [activeButton, setActiveButton] = useState("table");

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

    return (
    <TasksContext.Provider value={{ pageState, activeButton, setTable, setKanban, setCalendar }}>
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
