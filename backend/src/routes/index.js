const express = require('express');
const router = express.Router();
const auth_routes = require('./auth_routes');
const challengeRoutes = require('./challenge_routes');
const adminRoutes = require('./admin_routes');
const commentRoutes = require('./comment_routes');

/**
 * Point d'entrée principal de toutes les routes de l'API
 */

// Routes d'authentification - /api/auth/*
router.use('/auth', auth_routes);
router.use('/', challengeRoutes);
router.use('/admin', adminRoutes);
router.use('/comments', commentRoutes);

/**
 * Route racine de l'API - Message de bienvenue et documentation
 * GET /api
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API CDPI Network',
    version: '1.0.0',
    description: 'Plateforme de défis inter-villes pour La Plateforme_',
    endpoints: {
      auth: {
        register: {
          method: 'POST',
          path: '/auth/register',
          description: 'Inscription d\'un nouvel utilisateur'
        },
        login: {
          method: 'POST',
          path: '/auth/login',
          description: 'Connexion d\'un utilisateur (à venir)'
        },
        logout: {
          method: 'POST',
          path: '/auth/logout',
          description: 'Déconnexion (à venir)'
        },
        me: {
          method: 'GET',
          path: '/auth/profil',
          description: 'Informations de l\'utilisateur connecté (à venir)'
        }
      },
      challenges: {
        list: {
          method: 'GET',
          path: '/challenges',
          description: 'Récupérer la liste des défis'
        }
      }
    }
  });
});

module.exports = router;
