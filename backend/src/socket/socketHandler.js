// Gestionnaire des connexions WebSocket
// Gère tous les événements Socket.IO de l'application



const initializeSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(` Client connecté: ${socket.id}`);
    
    // Evenement de déconnexion
    socket.on('disconnect', () => {
      console.log(` Client déconnecté: ${socket.id}`);
    });
    
    // Evenement message
    socket.on('message', (data) => {
      console.log(' Message reçu:', data);
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

