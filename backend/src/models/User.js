const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

/**
 * Modèle User - Représente un utilisateur de la plateforme CDPI Network
 * Gère l'authentification et les informations de profil
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique de l\'utilisateur'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    comment: 'Email de l\'utilisateur (doit être @laplateforme.io)',
    validate: {
      isEmail: {
        msg: 'Format d\'email invalide'
      },
      is_laplateforme_email(value) {
        if (!value.endsWith('@laplateforme.io')) {
          throw new Error('L\'email doit être un email @laplateforme.io');
        }
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Mot de passe hashé avec bcrypt'
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Prénom de l\'utilisateur'
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Nom de famille de l\'utilisateur'
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Ville du campus La Plateforme_'
  },
  promo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Promotion de l\'étudiant (ex: AI1, Dev2, etc.)'
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    comment: 'Chemin vers l\'avatar de l\'utilisateur'
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    allowNull: false,
    comment: 'Rôle de l\'utilisateur (user ou admin)'
  },
  is_validated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Indique si le compte a été validé par un admin'
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    /**
     * Hook avant création - Hash le mot de passe avant de sauvegarder
     * @param {User} user - Instance de l'utilisateur à créer
     */
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12); // Augmenté à 12 rounds
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    /**
     * Hook avant mise à jour - Hash le mot de passe s'il a été modifié
     * @param {User} user - Instance de l'utilisateur à mettre à jour
     */
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12); // Augmenté à 12 rounds
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

/**
 * Compare un mot de passe en clair avec le mot de passe hashé
 * @param {string} candidate_password - Mot de passe en clair à vérifier
 * @returns {Promise<boolean>} True si les mots de passe correspondent
 */
User.prototype.compare_password = async function(candidate_password) {
  return await bcrypt.compare(candidate_password, this.password);
};

/**
 * Retourne l'objet utilisateur sans le mot de passe
 * Méthode appelée automatiquement lors de la sérialisation JSON
 * @returns {Object} Objet utilisateur sans le champ password
 */
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;
