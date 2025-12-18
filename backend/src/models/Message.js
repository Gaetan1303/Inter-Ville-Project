const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Modèle Message - Représente les messages privés entre utilisateurs
 * Organisés par room (conversation) entre deux utilisateurs
 */
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'Identifiant unique du message'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Contenu du message',
    validate: {
      len: {
        args: [1, 5000],
        msg: 'Le message doit contenir entre 1 et 5000 caractères'
      }
    }
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID de l\'utilisateur qui envoie le message',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID de l\'utilisateur qui reçoit le message',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  room_id: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Identifiant de la conversation (room) entre deux users'
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    comment: 'Indique si le message a été lu par le destinataire'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'messages',
  timestamps: true,
  updatedAt: false, // Pas de updatedAt pour les messages
  indexes: [
    {
      fields: ['sender_id']
    },
    {
      fields: ['receiver_id']
    },
    {
      fields: ['room_id']
    },
    {
      fields: ['is_read']
    }
  ]
});

/**
 * Génère un room_id unique pour une conversation entre deux utilisateurs
 * Le room_id est toujours le même peu importe qui envoie le message
 * @param {number} user_id_1 - ID du premier utilisateur
 * @param {number} user_id_2 - ID du deuxième utilisateur
 * @returns {string} room_id formaté
 */
Message.generate_room_id = (user_id_1, user_id_2) => {
  const sorted_ids = [user_id_1, user_id_2].sort((a, b) => a - b);
  return `room_${sorted_ids[0]}_${sorted_ids[1]}`;
};

module.exports = Message;
