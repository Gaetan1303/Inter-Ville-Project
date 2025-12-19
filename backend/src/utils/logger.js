const winston = require('winston');

/**
 * Configuration du logger Winston pour l'application
 * Logs structurés en JSON pour faciliter l'analyse
 */

// Format personnalisé pour les logs
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level,
      message,
      service: 'inter-ville-backend',
      environment: process.env.NODE_ENV || 'development',
      ...meta
    });
  })
);

// Création du logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { 
    service: 'inter-ville-backend',
    version: process.env.npm_package_version || '1.0.0'
  },
  transports: [
    // Console (pour Kubernetes)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    })
  ]
});

// En développement, ajouter des logs plus détaillés
if (process.env.NODE_ENV === 'development') {
  logger.add(new winston.transports.File({ 
    filename: 'logs/error.log', 
    level: 'error',
    format: logFormat
  }));
  logger.add(new winston.transports.File({ 
    filename: 'logs/combined.log',
    format: logFormat
  }));
}

/**
 * Middleware Express pour logger les requêtes HTTP
 */
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log de la requête entrante
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.id || Math.random().toString(36).substr(2, 9)
  });

  // Intercepter la fin de la réponse
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    // Log de la réponse
    logger.info('HTTP Response', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      responseSize: data ? data.length : 0,
      requestId: req.id || 'unknown'
    });

    return originalSend.call(this, data);
  };

  next();
};

/**
 * Helper functions pour différents niveaux de log
 */
const logError = (message, error = null, meta = {}) => {
  logger.error(message, {
    error: error?.message,
    stack: error?.stack,
    ...meta
  });
};

const logWarning = (message, meta = {}) => {
  logger.warn(message, meta);
};

const logInfo = (message, meta = {}) => {
  logger.info(message, meta);
};

const logDebug = (message, meta = {}) => {
  logger.debug(message, meta);
};

module.exports = {
  logger,
  requestLogger,
  logError,
  logWarning,
  logInfo,
  logDebug
};