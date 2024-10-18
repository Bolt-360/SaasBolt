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

            socket.on('qrcodeUpdated', (data) => {
                console.log('QRCode updated:', data);
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
