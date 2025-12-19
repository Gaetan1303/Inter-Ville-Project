const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authenticate = require('../middlewares/auth_middleware');

// Configuration de multer pour le stockage des avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Route pour téléverser un avatar
router.post('/avatar', authenticate, upload.single('avatar'), (req, res) => {
  try {
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    // Mettre à jour l'utilisateur avec l'URL de l'avatar
    // Exemple : User.update({ avatar: avatarUrl }, { where: { id: req.user.id } });
    res.status(200).json({ success: true, avatar: avatarUrl });
  } catch (error) {
    console.error('Erreur lors du téléversement de l\'avatar:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

module.exports = router;