const express = require("express");
const rateLimit = require("express-rate-limit");
const { swaggerUi, swaggerSpec } = require("./config/swagger");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
require("dotenv").config();
const routes = require("./routes");

/**
 * Configuration de l'application Express
 * Initialise tous les middlewares et routes
 */
const app = express();


// Rate limiting global (100 requêtes/15min par IP)
const limiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'test' ? 2000 : 15 * 60 * 1000, // 2 secondes en test, 15 min sinon
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    if (process.env.NODE_ENV === 'test') {
      // Désactive le rate-limit sur /api-docs et /auth/me en test
      return req.path.startsWith('/api-docs') || req.path === '/auth/me';
    }
    return false;
  }
});
app.use(limiter);
// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Middlewares de sécurité et performance
 */

// Helmet - Sécurise les headers HTTP
app.use(helmet());


// CORS - Autorise les requêtes cross-origin depuis le frontend
if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
  console.log("[CORS] Mode production : origine autorisée =", process.env.FRONTEND_URL);
} else {
  app.use(
    cors({
      origin: [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000" // Ajout pour Minikube
      ],
      credentials: true,
    })
  );
  console.log("[CORS] Mode développement : origines autorisées multiples");
}

// Redirection HTTP vers le frontend en production (placeholder)
if (process.env.NODE_ENV === "production") {
  app.get("/", (req, res) => {
    res.redirect(process.env.FRONTEND_URL || "/api-docs");
  });
}

// Compression - Compresse les réponses HTTP
app.use(compression());

// Morgan - Logger les requêtes HTTP en développement
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/**
 * Middlewares de parsing
 */

// Parse le body JSON des requêtes
app.use(express.json());

// Parse les données URL-encoded
app.use(express.urlencoded({ extended: true }));

/**
 * Routes de l'API
 */

// Point d'entrée principal de l'API
app.use("/", routes);

// Route de santé - Vérifie que l'API fonctionne
app.get("/heal", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API CDPI Network opérationnelle",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

/**
 * Gestion des routes non trouvées - 404
 */
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route non trouvée",
    path: req.originalUrl,
  });
});

/**
 * Middleware de gestion globale des erreurs
 */
app.use((error, req, res, next) => {
  console.error(" Erreur serveur:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Erreur interne du serveur",
    error: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
});

module.exports = app;
