// Gestionnaire des connexions WebSocket
// Gère tous les événements Socket.IO de l'application



const initializeSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    // Log connexion client supprimé pour sécurité
    
    // Evenement de déconnexion
    socket.on('disconnect', () => {
      // Log déconnexion client supprimé pour sécurité
    });
    
    // Evenement message
    socket.on('message', (data) => {
      // Log message reçu supprimé pour sécurité
      // Diffuser le message à tous les clients connectés
      io.emit('message', data);
    });
    
    // ici tous les autres evenement
    // Exemples :
    // socket.on('join_room', ...)
    // socket.on('leave_room', ...)
    // socket.on('chat_message', ...)
    
  });
};

module.exports = {
  initializeSocketHandlers
};

