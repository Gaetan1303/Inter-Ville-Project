const bcrypt = require('bcrypt');
const User = require('../models/User');
const { generate_token, generate_refresh_token, verify_token } = require('../services/token_service');
// Upload d'un avatar utilisateur
const { saveUpload } = require('../services/upload_service');
const uploadAvatar = (req, res) => {
  try {
    const { filename, data } = req.body;
    if (!filename || !data) {
      return res.status(400).json({ success: false, message: 'Paramètres manquants' });
    }
    const avatarPath = saveUpload(data, filename, 'avatars');
    res.status(201).json({ success: true, avatar: avatarPath });
  } catch (err) {
    res.status(500).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : err.message });
  }
};
const { send_welcome_email, send_validation_email } = require('../services/email_service');

/**
 * Inscription d'un nouvel utilisateur
 * @route POST /api/auth/register
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON avec les données de l'utilisateur créé
 */
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, city, promo } = req.body;

    // Validation des champs requis
    if (!email || !password || !first_name || !last_name || !city || !promo) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis',
      });
    }

    // Validation du format de l'email
    if (!email.endsWith('@laplateforme.io')) {
      return res.status(400).json({
        success: false,
        message: "Format d'email invalide",
      });
    }

    // Validation de la longueur du mot de passe
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 8 caractères',
      });
    }

    // Vérifier si un utilisateur avec cet email existe déjà
    const existing_user = await User.findOne({ where: { email } });
    if (existing_user) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      });
    }

    // Créer le nouvel utilisateur dans la base de données
    // On force toujours le rôle à 'user', même si un champ role est envoyé dans la requête
    const user = await User.create({
      email,
      password,
      first_name,
      last_name,
      city,
      promo,
      is_validated: false,
      role: 'user'
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
          promo: user.promo,
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
        message: process.env.NODE_ENV === 'production' ? 'Erreur de validation des données' : (error.errors[0]?.message || 'Erreur de validation des données'),
      });
    }

    // Gestion des erreurs de contrainte unique (doublon)
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Un compte avec cet email existe déjà' : 'Un compte avec cet email existe déjà'
      });
    }

    // Erreur générique du serveur
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? "Erreur lors de l'inscription" : error.message
    });
  }
};

/**
 * Connexion d'un utilisateur
 * @route POST /api/auth/login
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe sont requis',
      });
    }

    // console.log supprimé (données reçues)

    // Vérifier si l'utilisateur existe
    // console.log supprimé (recherche utilisateur)
    const user = await User.findOne({ where: { email } });
    // console.log supprimé (résultat recherche utilisateur)
    if (!user) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    // Vérifier le mot de passe
    // console.log supprimé (validation mot de passe)
    // console.log supprimé (mot de passe fourni)
    // console.log supprimé (hash stocké)

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    // console.log supprimé (résultat bcrypt)
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Identifiants invalides' });
    }

    // Vérifier si l'utilisateur est validé par un admin
    // console.log supprimé (validation statut utilisateur)
    if (!user.is_validated) {
      return res.status(403).json({ success: false, message: 'Votre compte doit être validé par un administrateur' });
    }

    // Générer les tokens
    // console.log supprimé (génération tokens)
    const accessToken = generate_token(user.id);
    const refreshToken = generate_refresh_token(user.id);

    // Ajout de logs pour inspecter les tokens générés et la réponse envoyée
    // console.log supprimé (tokens générés)
    // console.log supprimé (réponse envoyée)
    // Répondre avec les tokens
    // console.log supprimé (connexion réussie)
    return res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    return res.status(500).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : 'Erreur interne du serveur' });
  }
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
 * Récupérer les informations de l'utilisateur connecté
 * @route GET /auth/me
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON avec les informations de l'utilisateur connecté
 */
const get_me = async (req, res) => {
  try {
    const user = req.user; // L'utilisateur est attaché à req par le middleware auth_middleware

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur non authentifié",
      });
    }

    // Mise à jour de la structure de la réponse pour inclure un objet 'user' dans 'data'
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          city: user.city,
          promo: user.promo,
          role: user.role,
          is_validated: user.is_validated,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur connecté:", error);
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : error.message
    });
  }
};

/**
 * Rafraîchir le token d'accès
 * @route POST /api/auth/refresh-token
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON
 */
const refresh_token = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Vérifier si le refresh token est valide
    const decoded = verify_token(refreshToken);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
    }

    // Générer un nouveau token d'accès
    const newAccessToken = generate_token(decoded.id);

    return res.status(200).json({
      success: true,
      message: 'Token rafraîchi avec succès',
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    return res.status(500).json({ success: false, message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : 'Erreur interne du serveur' });
  }
};

/**
 * Validation d'un utilisateur par un administrateur
 * @route POST /api/auth/validate-user
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @returns {Object} Réponse JSON
 */

module.exports = {
  register,
  login,
  logout,
  get_me,
  refresh_token,
  uploadAvatar
};
