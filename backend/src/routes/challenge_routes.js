const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Route pour uploader une image de challenge (JSON: { filename, data })
router.post('/challenges/upload-image', async (req, res) => {
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
    const dest = path.join(__dirname, '../../uploads/challenges', filename);
    fs.writeFileSync(dest, fileData);
    const imagePath = `/uploads/challenges/${filename}`;
    res.status(201).json({ success: true, image: imagePath });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
const challengeController = require('../controllers/challenge_controller');

// Route pour lister les challenges avec filtres
router.get('/challenges', challengeController.getChallenges);

// Route pour obtenir le détail d'un challenge
router.get('/challenges/:id', challengeController.getChallengeById);


// Route pour créer un challenge
router.post('/challenges', challengeController.createChallenge);

// Route pour modifier un challenge
router.put('/challenges/:id', challengeController.updateChallenge);

// Route pour supprimer un challenge
router.delete('/challenges/:id', challengeController.deleteChallenge);

module.exports = router;