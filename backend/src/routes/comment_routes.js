const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment_controller');
const authenticate = require('../middlewares/auth_middleware');

// GET /comments/challenge/:id
router.get('/challenge/:id', commentController.getCommentsByChallenge);

// POST /comments (auth requis)
router.post('/', authenticate, commentController.addComment);

// DELETE /comments/:id (auth requis)
router.delete('/:id', authenticate, commentController.deleteComment);

module.exports = router;
