const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Comment = require('../models/Comment');
const Participation = require('../models/Participation');
const { sequelize } = require('../config/database');
const { send_validation_email } = require('../services/email_service');

/**
 * Récupérer les comptes en attente de validation
 * @route GET /admin/users/pending
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON avec la liste des comptes en attente
 */
const get_pending_users = async (req, res) => {
  try {
    // Vérifier que la connexion DB est active
    if (!User) {
      throw new Error('Modèle User non disponible');
    }
    
    const pendingUsers = await User.findAll({ where: { is_validated: false } });

    res.status(200).json({
      success: true,
      data: pendingUsers,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes en attente:", error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : error.message
    });
  }
};

/**
 * Valider un compte utilisateur
 * @route PUT /admin/users/:id/validate
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON confirmant la validation
 */
const validate_user = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'utilisateur existe
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Mettre à jour le champ is_validated
    user.is_validated = true;
    await user.save();

    // Envoyer un email de validation (non bloquant)
    send_validation_email(user.email, user.first_name).catch(err => {
      console.error('Erreur lors de l\'envoi de l\'email de validation:', err);
    });

    res.status(200).json({
      success: true,
      message: "Utilisateur validé avec succès",
      data: {
        id: user.id,
        email: user.email,
        is_validated: user.is_validated,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la validation de l'utilisateur:", error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : error.message
    });
  }
};

/**
 * Supprimer un challenge
 * @route DELETE /admin/challenges/:id
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON confirmant la suppression
 */
const delete_challenge = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le challenge existe
    const challenge = await Challenge.findByPk(id);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge non trouvé",
      });
    }

    // Supprimer le challenge
    await challenge.destroy();

    res.status(200).json({
      success: true,
      message: "Challenge supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du challenge:", error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : error.message
    });
  }
};

/**
 * Supprimer un commentaire
 * @route DELETE /admin/comments/:id
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON confirmant la suppression
 */
const delete_comment = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si le commentaire existe
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Commentaire non trouvé",
      });
    }

    // Supprimer le commentaire
    await comment.destroy();

    res.status(200).json({
      success: true,
      message: "Commentaire supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire:", error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : error.message
    });
  }
};

/**
 * Récupérer les statistiques globales
 * @route GET /admin/stats
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON avec les statistiques globales
 */
const get_stats = async (req, res) => {
  try {
    const [userCount, challengeCount, commentCount, participationCount, validatedUsers, activeUsers] = await Promise.all([
      User.count(),
      Challenge.count(),
      Comment.count(),
      Participation.count(),
      User.count({ where: { is_validated: true } }),
      User.count({ where: { is_validated: true, role: 'user' } })
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: userCount,
        challenges: challengeCount,
        comments: commentCount,
        participations: participationCount,
        validatedUsers: validatedUsers,
        activeUsers: activeUsers
      },
    });
  } catch (error) {
    // Log supprimé pour la production
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : error.message
    });
  }
};

/**
 * Récupérer le classement global
 * @route GET /admin/leaderboard
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON avec le classement
 */
const get_leaderboard = async (req, res) => {
  try {
    const type = req.query.type || 'global';
    let leaderboard;
    if (type === 'city') {
      leaderboard = await User.findAll({
        attributes: ['city', [sequelize.fn('SUM', sequelize.col('score')), 'totalScore']],
        include: [{ model: Participation, attributes: [] }],
        group: ['city'],
        order: [[sequelize.fn('SUM', sequelize.col('score')), 'DESC']],
      });
    } else if (type === 'promo') {
      leaderboard = await User.findAll({
        attributes: ['promo', [sequelize.fn('SUM', sequelize.col('score')), 'totalScore']],
        include: [{ model: Participation, attributes: [] }],
        group: ['promo'],
        order: [[sequelize.fn('SUM', sequelize.col('score')), 'DESC']],
      });
    } else {
      leaderboard = await User.findAll({
        attributes: ['id', 'first_name', 'last_name', 'score'],
        order: [['score', 'DESC']],
        limit: 10,
      });
    }
    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur serveur leaderboard' });
  }
};

/**
 * Récupérer les badges d'un utilisateur
 * @route GET /admin/users/:userId/badges
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON avec les badges de l'utilisateur
 */
const get_badges = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    
    const participations = await Participation.findAll({ where: { user_id: userId } });
    const badges = [];
    
    if (participations.length >= 5) badges.push('Participant régulier');
    if (participations.some(p => p.score >= 100)) badges.push('Score 100+');
    if (participations.length > 0) badges.push('Premier défi');
    
    res.status(200).json({ success: true, badges });
  } catch (error) {
    console.error('Erreur badges:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur badges' });
  }
};

module.exports = {
  get_pending_users,
  validate_user,
  delete_challenge,
  delete_comment,
  get_stats,
  get_leaderboard,
  get_badges,
};