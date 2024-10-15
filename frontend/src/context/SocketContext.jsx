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

    console.log('SocketContextProvider: authUser', authUser);

    useEffect(() => {
        console.log('useEffect: authUser', authUser);

        if (authUser && authUser.token && authUser.activeWorkspaceId) {
            console.log('Condição satisfeita: authUser, token e activeWorkspaceId existem');
            console.log('Conteúdo do authUser:', authUser);

            const socket = io('http://localhost:2345', {
                query: {
                    userId: authUser.id,
                    workspaceId: authUser.activeWorkspaceId
                }
            });

            setSocket(socket);
            socket.on('getOnlineUsers', (users) => {
                setOnlineUsers(users);
            });

            return () => socket.close();
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
