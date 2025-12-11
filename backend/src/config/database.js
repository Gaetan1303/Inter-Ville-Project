const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '/home/billy/Work/Inter-Ville-Project/backend/.env' });

/**
 * Configuration de la connexion à la base de données MySQL avec Sequelize
 * Utilise les variables d'environnement pour la configuration
 */
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,           // Nombre maximum de connexions dans le pool
      min: 0,           // Nombre minimum de connexions dans le pool
      acquire: 30000,   // Temps maximum (ms) pour obtenir une connexion
      idle: 10000       // Temps maximum (ms) qu'une connexion peut rester inactive
    },
    define: {
      timestamps: true,        // Ajoute automatiquement createdAt et updatedAt
      underscored: false,      // Utilise camelCase au lieu de snake_case
      freezeTableName: true    // Empêche Sequelize de pluraliser les noms de tables
    }
  }
);

/**
 * Teste la connexion à la base de données
 * Affiche un message de succès ou d'erreur
 * Termine le processus en cas d'échec
 */
const test_connection = async () => {
  try {
    await sequelize.authenticate();
    console.log(' Connexion à MySQL réussie');
  } catch (error) {
    console.error(' Erreur de connexion à MySQL:', error.message);
    process.exit(1);
  }
};

// Suppression des journaux pour éviter d'exposer les informations sensibles

module.exports = { sequelize, test_connection };
