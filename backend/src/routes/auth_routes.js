const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { register, login, logout, get_me, refresh_token, validate_user } = require('../controllers/auth_controller');
const authenticate = require('../middlewares/auth_middleware');

// Route pour uploader un avatar utilisateur (JSON: { filename, data })
router.post('/upload-avatar', async (req, res) => {
  try {
    const { filename, data } = req.body;
    if (!filename || !data) {
      return res.status(400).json({ success: false, message: 'filename et data requis' });
    }
    // Décoder le base64 si présent
    let fileData = data;
    if (typeof data === 'string' && data.startsWith('data:')) {
      fileData = data.split(',')[1];
      fileData = Buffer.from(fileData, 'base64');
    } else if (typeof data === 'string') {
      fileData = Buffer.from(data, 'base64');
    }
    const dest = path.join(__dirname, '../../uploads/avatars', filename);
    fs.writeFileSync(dest, fileData);
    const avatarPath = `/uploads/avatars/${filename}`;
    res.status(201).json({ success: true, avatar: avatarPath });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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
router.post('/validate-user', authenticate, validate_user);

module.exports = router;
