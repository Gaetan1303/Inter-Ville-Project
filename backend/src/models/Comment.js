const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modèle Comment - Représente les commentaires sur les challenges
 * Support des réponses en cascade via parentId (structure récursive)
 */
const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique du commentaire'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Contenu du commentaire',
    validate: {
      len: {
        args: [1, 2000],
        msg: 'Le commentaire doit contenir entre 1 et 2000 caractères'
      }
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID de l\'utilisateur qui a posté le commentaire',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  challenge_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID du challenge commenté',
    references: {
      model: 'challenges',
      key: 'id'
    }
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    comment: 'ID du commentaire parent (null si commentaire principal)',
    references: {
      model: 'comments',
      key: 'id'
    }
  }
}, {
  tableName: 'comments',
  timestamps: true,
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['challenge_id']
    },
    {
      fields: ['parent_id']
    }
  ]
});

/**
 * Définition de l'auto-référence pour les réponses aux commentaires
 * Un commentaire peut avoir plusieurs réponses
 */
Comment.hasMany(Comment, {
  as: 'replies',
  foreignKey: 'parent_id',
  onDelete: 'CASCADE'
});

Comment.belongsTo(Comment, {
  as: 'parent',
  foreignKey: 'parent_id'
});

module.exports = Comment;
