const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware pour vérifier le token JWT et attacher l'utilisateur à req.user
 * @param {Object} req - Objet de requête Express
 * @param {Object} res - Objet de réponse Express
 * @param {Function} next - Fonction pour passer au middleware suivant
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Token manquant ou invalide' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token); // Ajout de journaux pour déboguer les valeurs du jeton
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Contenu décodé du token:', decoded); // Ajout de journaux pour vérifier le contenu du token

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    req.user = user; // Attacher l'utilisateur à req.user
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);

    // Ajout de journaux pour afficher les erreurs rencontrées
    console.log('Erreur:', error.message);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }

    return res.status(401).json({ success: false, message: 'Authentification échouée' });
  }
};

module.exports = authenticate;