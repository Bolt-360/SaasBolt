import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const PipefullLayout = () => {
    return (
        <div className="flex h-screen bg-white">
            <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Outlet />
        </div>
        </div>
    );
};

export default PipefullLayout;