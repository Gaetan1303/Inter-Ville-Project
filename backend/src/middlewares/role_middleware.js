const authorizeAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Accès refusé : droits insuffisants',
    });
  } catch (error) {
    console.error('Erreur dans le middleware authorizeAdmin:', error);
    return res.status(500).json({
      success: false,
      message: 'Erreur serveur',
    });
  }
};

module.exports = authorizeAdmin;