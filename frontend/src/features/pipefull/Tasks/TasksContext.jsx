import React, { createContext, useState, useContext } from 'react';

// Crie o contexto
const TasksContext = createContext(undefined);

export const TasksProvider = ({ children }) => {
  // Estado que armazena qual botão foi clicado
  const [pageState, setPageState] = useState("table"); // "home" é o estado inicial

    const setTable = () => setPageState("table");
    const setKanban = () => setPageState("kanban");
    const setCalendar = () => setPageState("calendar");

    return (
    <TasksContext.Provider value={{ pageState, setTable, setKanban, setCalendar }}>
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
