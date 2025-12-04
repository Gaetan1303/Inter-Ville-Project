const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const routes = require('./routes');

/**
 * Configuration de l'application Express
 * Initialise tous les middlewares et routes
 */
const app = express();

/**
 * Middlewares de sécurité et performance
 */

// Helmet - Sécurise les headers HTTP
app.use(helmet());

// CORS - Autorise les requêtes cross-origin depuis le frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Compression - Compresse les réponses HTTP
app.use(compression());

// Morgan - Logger les requêtes HTTP en développement
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * Middlewares de parsing
 */

// Parse le body JSON des requêtes
app.use(express.json());

// Parse les données URL-encoded
app.use(express.urlencoded({ extended: true }));

/**
 * Routes de l'API
 */

// Point d'entrée principal de l'API
app.use('/', routes);

// Route de santé - Vérifie que l'API fonctionne
app.get('/heal', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API CDPI Network opérationnelle',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

/**
 * Gestion des routes non trouvées - 404
 */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

/**
 * Middleware de gestion globale des erreurs
 */
app.use((error, req, res, next) => {
  console.error(' Erreur serveur:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

module.exports = app;
