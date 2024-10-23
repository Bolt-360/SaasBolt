import React, { createContext, useState, useContext, useEffect } from 'react';

const DashboardContext = createContext(undefined);

export const DashboardProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedProjects = localStorage.getItem('projects');
      return savedProjects ? JSON.parse(savedProjects) : [
        { name: "Layout", color: "bg-primary" },
        { name: "Design do disparador", color: "bg-secondary" },
      ];
    }
    return [
      { name: "Layout", color: "bg-primary" },
      { name: "Design do disparador", color: "bg-secondary" },
    ];
  });

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = (name) => {
    const colors = ['bg-primary', 'bg-secondary', 'bg-accent', 'bg-muted'];
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setProjects([...projects, { name, color: newColor }]);
  };

  const removeProject = (projectName) => {
    setProjects(projects.filter(project => project.name !== projectName));
  };

  return (
    <DashboardContext.Provider value={{ projects, addProject, removeProject }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard deve ser usado dentro de um DashboardProvider');
  }
  return context;
};