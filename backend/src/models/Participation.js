const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modèle Participation - Table de jointure entre User et Challenge
 * Gère l'inscription et la progression des utilisateurs dans les challenges
 */
const Participation = sequelize.define('Participation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique de la participation'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID de l\'utilisateur participant',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  challenge_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID du challenge',
    references: {
      model: 'challenges',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('registered', 'in_progress', 'completed', 'abandoned'),
    defaultValue: 'registered',
    allowNull: false,
    comment: 'Statut de la participation de l\'utilisateur'
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    comment: 'Score obtenu par l\'utilisateur (null si non terminé)',
    validate: {
      min: 0,
      max: 100
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'participations',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'challenge_id'],
      name: 'unique_user_challenge'
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['challenge_id']
    },
    {
      fields: ['status']
    }
  ]
});

Participation.associate = (models) => {
  Participation.belongsTo(models.Challenge, {
    foreignKey: 'challenge_id',
    as: 'challenge',
  });
};

module.exports = Participation;
