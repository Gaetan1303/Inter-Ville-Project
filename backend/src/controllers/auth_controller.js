const User = require('../models/User');
const { generate_token, generate_refresh_token } = require('../services/token_service');
const { send_welcome_email } = require('../services/email_service');

/**
 * Inscription d'un nouvel utilisateur
 * @route POST /api/auth/register
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON avec les données de l'utilisateur créé
 */
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, city } = req.body;

    // Vérifier si un utilisateur avec cet email existe déjà
    const existing_user = await User.findOne({ where: { email } });
    
    if (existing_user) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      });
    }

    // Créer le nouvel utilisateur dans la base de données
    const user = await User.create({
      email,
      password,
      first_name,
      last_name,
      city,
      is_validated: false,  // Le compte nécessite une validation admin
      role: 'user'          // Rôle par défaut
    });

    // Envoyer l'email de bienvenue (asynchrone, ne bloque pas la réponse)
    send_welcome_email(email, first_name).catch(err => {
      console.error('Erreur email:', err);
    });

    // Répondre avec succès
    res.status(201).json({
      success: true,
      message: 'Inscription réussie. Votre compte est en attente de validation par un administrateur.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          city: user.city,
          is_validated: user.is_validated,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    // Gestion des erreurs de validation Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation des données',
        errors: error.errors.map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }

    // Gestion des erreurs de contrainte unique (doublon)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      });
    }

    // Erreur générique du serveur
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Connexion d'un utilisateur (à implémenter plus tard)
 * @route POST /api/auth/login
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON
 */
const login = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Fonctionnalité de connexion pas encore implémentée'
  });
};

/**
 * Déconnexion d'un utilisateur (à implémenter plus tard)
 * @route POST /api/auth/logout
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON
 */
const logout = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Fonctionnalité de déconnexion pas encore implémentée'
  });
};

/**
 * Récupère les informations de l'utilisateur connecté (à implémenter plus tard)
 * @route GET /api/auth/me
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON
 */
const get_me = async (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Fonctionnalité pas encore implémentée'
  });
};

module.exports = {
  register,
  login,
  logout,
  get_me
};
