const express = require('express');
const router = express.Router();
const { register, login, logout, get_me } = require('../controllers/auth_controller');
const { register_validator, login_validator } = require('../validators/auth_validator');
const validate = require('../middlewares/validation_middleware');

/**
 * Routes d'authentification
 */

// Route d'inscription - accessible à tous
// POST /auth/register
router.post('/register', register_validator, validate, register);

// Route de connexion - accessible à tous (à implémenter)
// POST /auth/login
router.post('/login', login_validator, validate, login);

// Route de déconnexion - nécessite authentification (à implémenter)
// POST /auth/logout
router.post('/logout', logout);

// Route pour obtenir l'utilisateur connecté - nécessite authentification (à implémenter)
// GET /auth/moi
router.get('/profil', get_me);

module.exports = router;
