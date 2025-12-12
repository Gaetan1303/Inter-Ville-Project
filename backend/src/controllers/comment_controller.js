const { Comment } = require('../models');
const { User } = require('../models');

// Récupérer tous les commentaires d'un challenge (avec réponses imbriquées)
exports.getCommentsByChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[GET] Récupération des commentaires pour le challenge', id);
    const comments = await Comment.findAll({
      where: { challenge_id: id, parent_id: null },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name', 'avatar', 'city', 'promo']
        },
        {
          model: Comment,
          as: 'replies',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'first_name', 'last_name', 'avatar', 'city', 'promo']
          }]
        }
      ],
      order: [['createdAt', 'ASC']]
    });
    console.log('[GET] Nombre de commentaires trouvés:', comments.length);
    res.json(comments);
  } catch (err) {
    console.error('[GET] Erreur récupération commentaires:', err);
    res.status(500).json({ error: err.message });
  }
};

// Ajouter un commentaire
exports.addComment = async (req, res) => {
  try {
    const { content, challenge_id, parent_id } = req.body;
    const user_id = req.user.id;
    console.log('[POST] Ajout commentaire', { content, challenge_id, user_id, parent_id });
    const comment = await Comment.create({ content, challenge_id, user_id, parent_id: parent_id || null });
    console.log('[POST] Commentaire créé avec id:', comment.id);
    res.status(201).json(comment);
  } catch (err) {
    console.error('[POST] Erreur ajout commentaire:', err);
    res.status(400).json({ error: err.message });
  }
};

// Supprimer un commentaire (par l'auteur ou admin)
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('[DELETE] Suppression commentaire id:', id);
    const comment = await Comment.findByPk(id);
    if (!comment) {
      console.warn('[DELETE] Commentaire non trouvé:', id);
      return res.status(404).json({ error: 'Commentaire non trouvé' });
    }
    if (req.user.role !== 'admin' && comment.user_id !== req.user.id) {
      console.warn('[DELETE] Non autorisé pour user', req.user.id);
      return res.status(403).json({ error: 'Non autorisé' });
    }
    await comment.destroy();
    console.log('[DELETE] Commentaire supprimé:', id);
    res.json({ message: 'Commentaire supprimé' });
  } catch (err) {
    console.error('[DELETE] Erreur suppression commentaire:', err);
    res.status(500).json({ error: err.message });
  }
};
