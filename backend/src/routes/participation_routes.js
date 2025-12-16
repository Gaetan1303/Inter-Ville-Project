const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/auth_middleware');
const participationController = require('../controllers/participation_controller');


// Créer une participation à un challenge
router.post('/:challengeId', authenticate, participationController.createParticipation);

// Récupérer toutes les participations d'un utilisateur
router.get('/user/:userId', authenticate, participationController.getParticipationsByUser);

// Récupérer toutes les participations d'un challenge
router.get('/challenge/:challengeId', authenticate, participationController.getParticipationsByChallenge);

// Supprimer une participation
router.delete('/:participationId', authenticate, participationController.deleteParticipation);

module.exports = router;
