const { validationResult } = require('express-validator');

/**
 * Middleware de validation des données de requête
 * Vérifie les erreurs de validation et renvoie une réponse appropriée
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 * @returns {Object} Réponse JSON avec les erreurs ou passe au suivant
 */
const validate = (req, res, next) => {
  // Récupère les erreurs de validation depuis la requête
  const errors = validationResult(req);
  
  // Si des erreurs sont présentes
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation des données',
      errors: errors.array().map(err => ({
        field: err.path,      // Nom du champ en erreur
        message: err.msg      // Message d'erreur
      }))
    });
  }
  
  // Si pas d'erreurs, passer au middleware suivant
  next();
};

module.exports = validate;
