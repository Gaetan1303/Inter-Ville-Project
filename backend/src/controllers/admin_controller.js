const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Comment = require('../models/Comment');

/**
 * Récupérer les comptes en attente de validation
 * @route GET /admin/users/pending
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON avec la liste des comptes en attente
 */
const get_pending_users = async (req, res) => {
  try {
    const pendingUsers = await User.findAll({ where: { is_validated: false } });

    res.status(200).json({
      success: true,
      data: pendingUsers,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes en attente:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
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
      message: "Erreur serveur",
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
      message: "Erreur serveur",
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
      message: "Erreur serveur",
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
    const userCount = await User.count();
    const challengeCount = await Challenge.count();
    const commentCount = await Comment.count();

    res.status(200).json({
      success: true,
      data: {
        users: userCount,
        challenges: challengeCount,
        comments: commentCount,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
    });
  }
};

module.exports = {
  get_pending_users,
  validate_user,
  delete_challenge,
  delete_comment,
  get_stats,
};