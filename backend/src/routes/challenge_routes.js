const express = require('express');
const router = express.Router();
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