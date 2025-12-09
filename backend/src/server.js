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
    console.log(' Modèles synchronisés avec la base de données');
    
    // Démarrer le serveur HTTP avec Socket.IO
    server.listen(PORT, () => {
      console.log('');
      console.log(' ================================');
      console.log(` Serveur CDPI Network démarré`);
      console.log(` Environnement: ${process.env.NODE_ENV}`);
      console.log(` Port: ${PORT}`);
      console.log(` URL: http://localhost:${PORT}`);
      console.log(` API: http://localhost:${PORT}/`);
      console.log(` WebSocket: Socket.IO activé`);
      console.log(' ================================');
      console.log('');
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
  console.log('\n  Arrêt du serveur en cours...');
  
  try {
    await sequelize.close();
    console.log(' Connexion à la base de données fermée');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de la fermeture de la connexion à la base de données:', error);
  }
});

// Démarrer le serveur
start_server();

// Exporter l'instance Socket.IO
module.exports.io = io;
