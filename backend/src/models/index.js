const { sequelize } = require('../config/database');
const User = require('./User');

/**
 * Index des modèles - Centralise tous les modèles et leurs associations
 * Les associations entre modèles seront définies ici
 */

// Importer les autres modèles ici quand ils seront créés
// const Challenge = require('./Challenge');
// const Comment = require('./Comment');
// const Participation = require('./Participation');
// const Message = require('./Message');

/**
 * Définition des associations entre modèles
 * À implémenter quand les autres modèles seront créés
 */
const init_associations = () => {
  // Exemple d'associations à créer plus tard :
  // User.hasMany(Challenge, { foreignKey: 'created_by', as: 'challenges' });
  // Challenge.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
};

// Appeler la fonction d'initialisation des associations
// init_associations();

/**
 * Objet contenant tous les modèles et l'instance Sequelize
 */
const db = {
  sequelize,
  User
  // Ajouter les autres modèles ici
};

module.exports = db;
