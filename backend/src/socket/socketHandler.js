// Gestionnaire des connexions WebSocket
// Gère tous les événements Socket.IO de l'application

/**
 * Stocke les utilisateurs connectés
 * Format: { socketId: { userId, userName, userCity, socketId } }
 */
const connectedUsers = new Map();

const initializeSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log(` Client connecté: ${socket.id}`);
    
    // Événement: Un utilisateur rejoint le chat
    socket.on('user:join', (userData) => {
      const userInfo = {
        userId: userData.userId,
        userName: userData.userName,
        userCity: userData.userCity,
        socketId: socket.id
      };
      
      // Stocker l'utilisateur
      connectedUsers.set(socket.id, userInfo);
      
      // Envoyer la liste des utilisateurs en ligne à tous les clients
      const onlineUsersList = Array.from(connectedUsers.values());
      io.emit('users:online', onlineUsersList);
      
      // Notifier les autres utilisateurs qu'un nouvel utilisateur s'est connecté
      socket.broadcast.emit('user:connected', userInfo);
      
      console.log(` Utilisateur connecté: ${userData.userName} (${userData.userId})`);
    });
    
    // Événement: Envoi de message
    socket.on('message', (data) => {
      console.log(' Message reçu:', data);
      
      // Ajouter un timestamp si absent
      if (!data.timestamp) {
        data.timestamp = new Date().toISOString();
      }
      
      // Diffuser le message à tous les clients connectés
      io.emit('message', data);
    });
    
    // Événement: Un utilisateur quitte le chat
    socket.on('user:leave', (userData) => {
      const userInfo = connectedUsers.get(socket.id);
      if (userInfo) {
        connectedUsers.delete(socket.id);
        
        // Envoyer la liste mise à jour des utilisateurs en ligne
        const onlineUsersList = Array.from(connectedUsers.values());
        io.emit('users:online', onlineUsersList);
        
        // Notifier les autres utilisateurs qu'un utilisateur s'est déconnecté
        socket.broadcast.emit('user:disconnected', userInfo.userId);
        
        console.log(` Utilisateur déconnecté: ${userInfo.userName} (${userInfo.userId})`);
      }
    });
    
    // Événement de déconnexion
    socket.on('disconnect', () => {
      const userInfo = connectedUsers.get(socket.id);
      if (userInfo) {
        connectedUsers.delete(socket.id);
        
        // Envoyer la liste mise à jour des utilisateurs en ligne
        const onlineUsersList = Array.from(connectedUsers.values());
        io.emit('users:online', onlineUsersList);
        
        // Notifier les autres utilisateurs qu'un utilisateur s'est déconnecté
        socket.broadcast.emit('user:disconnected', userInfo.userId);
        
        console.log(` Client déconnecté: ${userInfo.userName} (${userInfo.userId})`);
      } else {
        console.log(` Client déconnecté: ${socket.id}`);
      }
    });
  });
};

module.exports = {
  initializeSocketHandlers
};

