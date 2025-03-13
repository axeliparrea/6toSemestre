const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Gestión de Usuarios',
    version: '1.0.0',
    description: 'API REST para gestión de usuarios con autenticación',
    contact: {
      name: 'Soporte Técnico',
      email: 'soporte@miapi.com'
    }
  },
  servers: [
    {
      url: `http://localhost:${process.env.BACK_PORT || 3000}`, 
      description: 'Servidor de desarrollo'
    }
  ],
  security: [{
    bearerAuth: []
  }]
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"] 
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
