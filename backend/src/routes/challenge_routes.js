const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const challengeController = require('../controllers/challenge_controller');

// Route pour uploader une image de challenge (JSON: { filename, data })
router.post('/upload-image', challengeController.uploadChallengeImage);

// Route pour lister les challenges avec filtres
router.get('/challenges', challengeController.getChallenges);

// Route pour obtenir le détail d'un challenge
router.get('/challenges/:id', challengeController.getChallengeById);


const { validateChallenge } = require('../validators/challenge_validator');
const authenticate = require('../middlewares/auth_middleware');

// Route pour créer un challenge (avec validation)
router.post('/challenges', authenticate, validateChallenge, challengeController.createChallenge);

// Route pour modifier un challenge (avec validation)
router.put('/challenges/:id', authenticate, validateChallenge, challengeController.updateChallenge);

// Route pour supprimer un challenge
router.delete('/challenges/:id', authenticate, challengeController.deleteChallenge);

module.exports = router;