import React, { useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import { useAuthContext } from './AuthContext';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';

const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();


    useEffect(() => {
        if (authUser && authUser.token && authUser.activeWorkspaceId) {
            const newSocket = io('http://localhost:2345', {
                query: {
                    userId: authUser.id,
                    workspaceId: authUser.activeWorkspaceId
                }
            });

            newSocket.on('connect', () => {
                newSocket.emit('joinWorkspace', authUser.activeWorkspaceId);
                setSocket(newSocket);
            });

            newSocket.on('getOnlineUsers', (users) => {
                setOnlineUsers(users);
            });

            return () => newSocket.close();
        } else {
            console.log('Condição não satisfeita: authUser, token ou activeWorkspaceId não existem');
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]); // Adicione authUser como dependência

    return (
        <SocketContext.Provider value={{ socket, onlineUsers, setOnlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
}

export default SocketContext;
