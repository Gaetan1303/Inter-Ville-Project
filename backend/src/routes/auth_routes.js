const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { register, login, logout, get_me, refresh_token, uploadAvatar } = require('../controllers/auth_controller');
const authenticate = require('../middlewares/auth_middleware');

// Route pour uploader un avatar utilisateur (JSON: { filename, data })
router.post('/upload-avatar', uploadAvatar);

/**
 * Routes d'authentification
 */

// Route d'inscription - accessible à tous
// POST /auth/register
router.post('/register', register);

// Route de connexion - accessible à tous
// POST /auth/login
router.post('/login', login);

// Route de déconnexion - nécessite authentification (à implémenter)
// POST /auth/logout
router.post('/logout', logout);

// Route pour obtenir l'utilisateur connecté - nécessite authentification
// GET /auth/me
router.get('/me', authenticate, get_me);

// Route pour rafraîchir les tokens - accessible à tous
// POST /auth/refresh-token
router.post('/refresh-token', refresh_token);

// Route pour valider un utilisateur - nécessite authentification admin
// POST /auth/validate-user

module.exports = router;
