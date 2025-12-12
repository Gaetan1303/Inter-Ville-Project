const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { sequelize, test_connection } = require('./config/database');
const { initializeSocketHandlers } = require('./socket/socketHandler');
require('dotenv').config();

/**
 * Port du serveur
 */
const PORT = process.env.PORT || 5000;

/**
 * Configuration Socket.IO
 */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

/**
 * Initialisation des gestionnaires WebSocket
 */
initializeSocketHandlers(io);

/**
 * Démarrage du serveur
 * 1. Teste la connexion à la base de données
 * 2. Synchronise les modèles avec la base de données
 * 3. Démarre le serveur HTTP avec Socket.IO
 */
const start_server = async () => {
  try {
    // Tester la connexion à MySQL
    await test_connection();
    
    // Synchroniser les modèles avec la base de données
    // { alter: true } met à jour la structure sans supprimer les données
    await sequelize.sync({ alter: true });
    // console.log supprimé (synchronisation modèles)
    
    // Démarrer le serveur HTTP avec Socket.IO
    server.listen(PORT, () => {
      // console.log supprimé (bannière serveur)
      // console.log supprimé (serveur démarré)
      // console.log supprimé (environnement)
      // console.log supprimé (port)
      // console.log supprimé (url)
      // console.log supprimé (api)
      // console.log supprimé (websocket)
      // console.log supprimé (bannière serveur)
      // console.log supprimé (ligne vide)
    });
    
  } catch (error) {
    console.error(' Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
};

/**
 * Gestion de l'arrêt gracieux du serveur
 */
process.on('SIGINT', async () => {
  // console.log supprimé (arrêt serveur)
  
  try {
    await sequelize.close();
    // console.log supprimé (fermeture bdd)
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la fermeture de la connexion à la base de données:', error);
  }
});

// Démarrer le serveur
start_server();

// Exporter l'instance Socket.IO
module.exports.io = io;
