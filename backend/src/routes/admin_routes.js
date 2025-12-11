const express = require('express');
const router = express.Router();
const { get_pending_users, validate_user, delete_challenge, delete_comment, get_stats } = require('../controllers/admin_controller');
const authenticate = require('../middlewares/auth_middleware');
const authorizeAdmin = require('../middlewares/role_middleware');

/**
 * Routes Admin
 */

// Route pour récupérer les comptes en attente de validation
// GET /admin/users/pending
router.get('/users/pending', authenticate, authorizeAdmin, get_pending_users);

// Route pour valider un compte utilisateur
// PUT /admin/users/:id/validate
router.put('/users/:id/validate', authenticate, authorizeAdmin, validate_user);

// Route pour supprimer un challenge
// DELETE /admin/challenges/:id
router.delete('/challenges/:id', authenticate, authorizeAdmin, delete_challenge);

// Route pour supprimer un commentaire
// DELETE /admin/comments/:id
router.delete('/comments/:id', authenticate, authorizeAdmin, delete_comment);

// Route pour récupérer les statistiques globales
// GET /admin/stats
router.get('/stats', authenticate, authorizeAdmin, get_stats);

module.exports = router;