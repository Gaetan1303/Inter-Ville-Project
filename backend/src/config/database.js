const { Sequelize } = require('sequelize');
const redis = require('redis');
require('dotenv').config();

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
      max: 10,          // Nombre maximum de connexions dans le pool (augmenté)
      min: 2,           // Nombre minimum de connexions dans le pool (augmenté)
      acquire: 30000,   // Temps maximum (ms) pour obtenir une connexion
      idle: 10000       // Temps maximum (ms) qu'une connexion peut rester inactive
    },
    define: {
      timestamps: false,       // Désactivé globalement - chaque modèle gère ses timestamps
      underscored: false,      // Désactivé - chaque modèle spécifie sa convention
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
    // console.log supprimé (connexion MySQL)
  } catch (error) {
    console.error(' Erreur de connexion à MySQL:', error.message);
    process.exit(1);
  }
};

// Configuration de la connexion Redis
let redisClient = null;

try {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  redisClient = redis.createClient({
    url: redisUrl,
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        console.log('⚠️  Redis server refused connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        console.log('⚠️  Redis retry time exhausted');
        return new Error('Retry time exhausted');
      }
      if (options.attempt > 10) {
        console.log('⚠️  Redis retry attempts exhausted');
        return undefined;
      }
      // Reconnect after
      return Math.min(options.attempt * 100, 3000);
    }
  });

  redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    console.error('❌ Redis connection error:', err.message);
  });

  redisClient.on('ready', () => {
    console.log('🚀 Redis is ready to use');
  });

  // Connect to Redis
  redisClient.connect().catch((err) => {
    console.error('⚠️  Redis initial connection failed:', err.message);
    console.log('🔄 Application will continue without Redis cache');
  });

} catch (error) {
  console.error('⚠️  Redis setup failed:', error.message);
  console.log('🔄 Application will continue without Redis cache');
  redisClient = null;
}

module.exports = { sequelize, test_connection, redisClient };
