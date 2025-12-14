import React, { useEffect, useState, useRef, useCallback, useMemo, startTransition } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SocketContext } from './socketContextValue';

export const SocketProvider = ({ children }) => {
  // setSocket est une fonction stable de useState, pas besoin de l'inclure dans les dépendances
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, token } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    // Se connecter uniquement si l'utilisateur est authentifié
    if (user && token) {
      const serverURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      
      // Créer la connexion Socket.IO
      const newSocket = io(serverURL, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      socketRef.current = newSocket;
      // Mettre à jour le state du socket dans une transition pour éviter les rendus en cascade
      // C'est nécessaire pour synchroniser avec Socket.IO (système externe)
      startTransition(() => {
        setSocket(newSocket);
      });

      // Événements de connexion
      newSocket.on('connect', () => {
        console.log('Socket connecté:', newSocket.id);
        setIsConnected(true);
        
        // Envoyer les informations utilisateur au serveur
        newSocket.emit('user:join', {
          userId: user.id,
          userName: `${user.first_name} ${user.last_name}`,
          userCity: user.city
        });
      });

      newSocket.on('disconnect', () => {
        console.log('Socket déconnecté');
        setIsConnected(false);
        setOnlineUsers([]);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Erreur de connexion Socket:', error);
        setIsConnected(false);
      });

      // Écouter la liste des utilisateurs en ligne
      newSocket.on('users:online', (users) => {
        setOnlineUsers(users);
      });

      // Écouter les nouveaux utilisateurs connectés
      newSocket.on('user:connected', (userData) => {
        setOnlineUsers((prev) => {
          if (!prev.find(u => u.userId === userData.userId)) {
            return [...prev, userData];
          }
          return prev;
        });
      });

      // Écouter les utilisateurs déconnectés
      newSocket.on('user:disconnected', (userId) => {
        setOnlineUsers((prev) => prev.filter(u => u.userId !== userId));
      });

      // Nettoyage à la déconnexion
      return () => {
        if (newSocket && newSocket.connected) {
          newSocket.emit('user:leave', { userId: user.id });
        }
        newSocket.disconnect();
        setSocket(null);
        setIsConnected(false);
        setOnlineUsers([]);
        socketRef.current = null;
      };
    } else {
      // Déconnecter si l'utilisateur n'est plus authentifié
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        startTransition(() => {
          setSocket(null);
          setIsConnected(false);
          setOnlineUsers([]);
        });
      }
    }
  }, [user, token]);

  const sendMessage = useCallback((message) => {
    const currentSocket = socketRef.current || socket;
    if (currentSocket && isConnected && user) {
      currentSocket.emit('message', {
        content: message,
        userId: user.id,
        userName: `${user.first_name} ${user.last_name}`,
        userCity: user.city,
        timestamp: new Date().toISOString()
      });
    }
  }, [socket, isConnected, user]);

  const contextValue = useMemo(
    () => ({
      socket,
      isConnected,
      onlineUsers,
      sendMessage
    }),
    [socket, isConnected, onlineUsers, sendMessage]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};


