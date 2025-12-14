import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../contexts/AuthContext';
import './ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const { socket, isConnected, onlineUsers } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  // Scroll automatique vers le bas lors de nouveaux messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Écouter les messages du serveur
  useEffect(() => {
    if (socket && isConnected) {
      const handleMessage = (data) => {
        setMessages((prev) => {
          // Éviter les doublons en vérifiant si le message existe déjà
          // Comparaison basée sur le contenu, userId et timestamp
          const isDuplicate = prev.some(
            (msg) =>
              msg.content === data.content &&
              msg.userId === data.userId &&
              msg.timestamp === data.timestamp
          );
          
          if (isDuplicate) {
            return prev;
          }
          
          return [...prev, data];
        });
      };

      socket.on('message', handleMessage);

      return () => {
        socket.off('message', handleMessage);
      };
    }
  }, [socket, isConnected]);

  // Gérer l'envoi de message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !socket || !isConnected || !user) {
      return;
    }

    const messageData = {
      content: inputMessage.trim(),
      userId: user.id,
      userName: `${user.first_name} ${user.last_name}`,
      userCity: user.city,
      timestamp: new Date().toISOString()
    };

    // Envoyer le message via Socket.IO
    // Le serveur renverra le message à tous les clients (y compris l'expéditeur)
    // donc pas besoin de l'ajouter localement pour éviter les doublons
    socket.emit('message', messageData);
    setInputMessage('');
  };

  // Formater l'heure
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Si l'utilisateur n'est pas connecté, ne pas afficher le chat
  if (!user) {
    return null;
  }

  return (
    <div className="chat-widget-container">
      {/* Bouton pour ouvrir le chat - masqué quand le chat est ouvert */}
      {!isOpen && (
        <button
          className="chat-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Ouvrir le chat"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}

      {/* Fenêtre de chat */}
      {isOpen && (
        <div className="chat-window">
          {/* En-tête du chat */}
          <div className="chat-header">
            <div className="chat-header-info">
              <h3>Chat Communauté</h3>
              <div className="chat-status">
                <span
                  className={`chat-status-dot ${isConnected ? 'connected' : 'disconnected'}`}
                ></span>
                <span className="chat-status-text">
                  {isConnected
                    ? `${onlineUsers.length} connecté${onlineUsers.length > 1 ? 's' : ''}`
                    : 'Déconnecté'}
                </span>
              </div>
            </div>
            <button
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Fermer le chat"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Liste des messages */}
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-empty">
                <p>Aucun message pour le moment</p>
                <span className="chat-empty-hint">
                  Soyez le premier à envoyer un message !
                </span>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isOwnMessage = msg.userId === user.id;
                return (
                  <div
                    key={index}
                    className={`chat-message ${isOwnMessage ? 'chat-message-own' : ''}`}
                  >
                    <div className="chat-message-header">
                      <span className="chat-message-author">
                        {isOwnMessage ? 'Vous' : msg.userName}
                      </span>
                      {msg.userCity && (
                        <span className="chat-message-city">{msg.userCity}</span>
                      )}
                      <span className="chat-message-time">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <div className="chat-message-content">{msg.content}</div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Zone de saisie */}
          <form className="chat-input-container" onSubmit={handleSendMessage}>
            <input
              type="text"
              className="chat-input"
              placeholder={
                isConnected
                  ? 'Tapez votre message...'
                  : 'Connexion en cours...'
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={!isConnected}
              maxLength={500}
            />
            <button
              type="submit"
              className="chat-send-btn"
              disabled={!isConnected || !inputMessage.trim()}
              aria-label="Envoyer le message"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;

