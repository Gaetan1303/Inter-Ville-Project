const jwt = require('jsonwebtoken');

/**
 * Génère un token JWT d'accès pour l'authentification
 * @param {number} user_id - ID de l'utilisateur
 * @returns {string} Token JWT signé
 */
const generate_token = (user_id) => {
  return jwt.sign(
    { id: user_id },
    process.env.JWT_SECRET,
    { expiresIn: jwtExpire }
  );
};

/**
 * Génère un refresh token JWT pour renouveler l'accès
 * @param {number} user_id - ID de l'utilisateur
 * @returns {string} Refresh token JWT signé
 */
const generate_refresh_token = (user_id) => {
  return jwt.sign(
    { id: user_id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Vérifie et décode un token JWT
 * @param {string} token - Token JWT à vérifier
 * @returns {Object|null} Données décodées du token ou null si invalide
 */
const verify_token = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Vérifie si un token JWT est expiré
 * @param {string} token - Token JWT à vérifier
 * @returns {boolean} True si le token est expiré, sinon false
 */
const is_token_expired = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return false; // Le token est valide
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return true; // Le token est expiré
    }
    throw error; // Autre erreur
  }
};

/**
 * Génère un token JWT d'accès pour un administrateur
 * @param {number} admin_id - ID de l'administrateur
 * @returns {string} Token JWT signé pour l'administrateur
 */
const generate_admin_token = (admin_id) => {
  return jwt.sign(
    { id: admin_id, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: jwtExpire }
  );
};

// Augmenter la durée de vie des tokens pour les tests
const isTestEnvironment = process.env.NODE_ENV === 'test';
const jwtExpire = isTestEnvironment ? '30d' : process.env.JWT_EXPIRE || '1h';

// Ajout de journaux pour vérifier la valeur de JWT_SECRET
// console.log supprimé pour sécurité

module.exports = {
  generate_token,
  generate_refresh_token,
  verify_token,
  is_token_expired,
  generate_admin_token,
};
