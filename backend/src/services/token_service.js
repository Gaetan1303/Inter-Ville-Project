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
    { expiresIn: process.env.JWT_EXPIRE }
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
    { expiresIn: process.env.JWT_REFRESH_EXPIRE }
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

module.exports = {
  generate_token,
  generate_refresh_token,
  verify_token
};
