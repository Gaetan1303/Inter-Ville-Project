const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modèle Challenge - Représente un défi inter-villes
 * Les utilisateurs peuvent créer, participer et commenter les challenges
 */
const Challenge = sequelize.define('Challenge', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique du challenge'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Titre du challenge'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Description détaillée du challenge'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    comment: 'Catégorie du challenge (code, design, sport, etc.)'
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    allowNull: false,
    comment: 'Niveau de difficulté du challenge'
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    defaultValue: 'active',
    allowNull: false,
    comment: 'Statut actuel du challenge'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Date de début du challenge'
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Date de fin du challenge',
    validate: {
      is_after_start_date(value) {
        if (value <= this.start_date) {
          throw new Error('La date de fin doit être après la date de début');
        }
      }
    }
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
    defaultValue: null,
    comment: 'Chemin vers l\'image du challenge'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID de l\'utilisateur créateur du challenge',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'challenges',
  timestamps: true,
  indexes: [
    {
      fields: ['created_by']
    },
    {
      fields: ['status']
    },
    {
      fields: ['difficulty']
    },
    {
      fields: ['category']
    }
  ]
});

module.exports = Challenge;
