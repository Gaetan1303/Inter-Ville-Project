// Configuration Swagger pour la documentation de l'API
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CDPI Network API',
      version: '1.0.0',
      description: 'Documentation de l’API du backend Inter-Ville-Project',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/models/*.js'], // Documentation dans les routes et modèles
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };