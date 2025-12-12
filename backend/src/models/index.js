const { sequelize } = require('../config/database');
const User = require('./User');
const Challenge = require('./Challenge');
const Participation = require('./Participation');
const Comment = require('./Comment');
const Message = require('./Message');

/**
 * Index des modèles - Centralise tous les modèles et leurs associations
 * Définit les relations entre les différentes entités de la base de données
 */

/**
 * Définition des associations entre modèles
 */
const init_associations = () => {
  
  // ==================== ASSOCIATIONS USER ====================
  
  /**
   * Un utilisateur peut créer plusieurs challenges
   * Un challenge appartient à un utilisateur créateur
   */
  User.hasMany(Challenge, {
    foreignKey: 'created_by',
    as: 'created_challenges',
    onDelete: 'CASCADE'
  });
  
  Challenge.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'creator'
  });

  /**
   * Un utilisateur peut participer à plusieurs challenges (via Participation)
   * Un challenge peut avoir plusieurs participants (via Participation)
   */
  User.belongsToMany(Challenge, {
    through: Participation,
    foreignKey: 'user_id',
    otherKey: 'challenge_id',
    as: 'participated_challenges'
  });
  
  Challenge.belongsToMany(User, {
    through: Participation,
    foreignKey: 'challenge_id',
    otherKey: 'user_id',
    as: 'participants'
  });

  /**
   * Un utilisateur peut avoir plusieurs participations
   * Une participation appartient à un utilisateur
   */
  User.hasMany(Participation, {
    foreignKey: 'user_id',
    as: 'participations',
    onDelete: 'CASCADE'
  });
  
  Participation.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
  });

  /**
   * Un challenge peut avoir plusieurs participations
   * Une participation appartient à un challenge
   */
  Challenge.hasMany(Participation, {
    foreignKey: 'challenge_id',
    as: 'participations',
    onDelete: 'CASCADE'
  });
  
  Participation.belongsTo(Challenge, {
    foreignKey: 'challenge_id',
    as: 'challenge'
  });

  // ==================== ASSOCIATIONS COMMENT ====================
  
  /**
   * Un utilisateur peut écrire plusieurs commentaires
   * Un commentaire appartient à un utilisateur
   */
  User.hasMany(Comment, {
    foreignKey: 'user_id',
    as: 'comments',
    onDelete: 'CASCADE'
  });
  
  Comment.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'author'
  });

  /**
   * Un challenge peut avoir plusieurs commentaires
   * Un commentaire appartient à un challenge
   */
  Challenge.hasMany(Comment, {
    foreignKey: 'challenge_id',
    as: 'comments',
    onDelete: 'CASCADE'
  });
  
  Comment.belongsTo(Challenge, {
    foreignKey: 'challenge_id',
    as: 'challenge'
  });

  // ==================== ASSOCIATIONS MESSAGE ====================
  
  /**
   * Un utilisateur peut envoyer plusieurs messages
   * Un message a un expéditeur (sender)
   */
  User.hasMany(Message, {
    foreignKey: 'sender_id',
    as: 'sent_messages',
    onDelete: 'CASCADE'
  });
  
  Message.belongsTo(User, {
    foreignKey: 'sender_id',
    as: 'sender'
  });

  /**
   * Un utilisateur peut recevoir plusieurs messages
   * Un message a un destinataire (receiver)
   */
  User.hasMany(Message, {
    foreignKey: 'receiver_id',
    as: 'received_messages',
    onDelete: 'CASCADE'
  });
  
  Message.belongsTo(User, {
    foreignKey: 'receiver_id',
    as: 'receiver'
  });

  // console.log supprimé (associations modèles)
};

// Initialiser les associations
init_associations();

/**
 * Objet contenant tous les modèles et l'instance Sequelize
 */
const db = {
  sequelize,
  User,
  Challenge,
  Participation,
  Comment,
  Message
};

module.exports = db;
