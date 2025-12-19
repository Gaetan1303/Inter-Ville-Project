const { redisClient } = require('../config/database');

/**
 * Service de cache Redis
 * Fournit des méthodes helper pour interagir avec Redis
 */
class RedisService {
  
  /**
   * Vérifie si Redis est disponible
   * @returns {boolean}
   */
  static isAvailable() {
    return redisClient && redisClient.isReady;
  }

  /**
   * Met en cache une valeur avec une durée d'expiration
   * @param {string} key - Clé du cache
   * @param {any} value - Valeur à cacher
   * @param {number} ttl - Durée de vie en secondes (défaut: 300s = 5min)
   */
  static async set(key, value, ttl = 300) {
    if (!this.isAvailable()) {
      console.log('⚠️  Redis not available, skipping cache set');
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      await redisClient.setEx(key, ttl, serializedValue);
      return true;
    } catch (error) {
      console.error('❌ Redis SET error:', error.message);
      return false;
    }
  }

  /**
   * Récupère une valeur du cache
   * @param {string} key - Clé du cache
   * @returns {any|null} - Valeur désérialisée ou null si non trouvée
   */
  static async get(key) {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const value = await redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('❌ Redis GET error:', error.message);
      return null;
    }
  }

  /**
   * Supprime une clé du cache
   * @param {string} key - Clé à supprimer
   */
  static async delete(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      await redisClient.del(key);
      return true;
    } catch (error) {
      console.error('❌ Redis DELETE error:', error.message);
      return false;
    }
  }

  /**
   * Supprime toutes les clés correspondant au pattern
   * @param {string} pattern - Pattern de clés (ex: "user:*")
   */
  static async deletePattern(pattern) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const keys = await redisClient.keys(pattern);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
      return true;
    } catch (error) {
      console.error('❌ Redis DELETE PATTERN error:', error.message);
      return false;
    }
  }

  /**
   * Vérifie si une clé existe
   * @param {string} key - Clé à vérifier
   * @returns {boolean}
   */
  static async exists(key) {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      console.error('❌ Redis EXISTS error:', error.message);
      return false;
    }
  }
}

module.exports = RedisService;