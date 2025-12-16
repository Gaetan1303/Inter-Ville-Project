const swaggerJsdoc = require('swagger-jsdoc');
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
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Serveur de développement',
      },
    ],
  },
  apis: ['src/routes/**/*.js', 'src/controllers/**/*.js', 'src/models/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };