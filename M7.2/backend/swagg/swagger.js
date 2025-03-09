const swaggerJSDoc = require('swagger-jsdoc');

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
      url: 'http://localhost:3000/api',
      description: 'Servidor de desarrollo'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        required: ['Name', 'Email', 'PasswordHash'],
        properties: {
          id: {
            type: 'integer',
            description: 'ID único del usuario'
          },
          Name: {
            type: 'string',
            description: 'Nombre del usuario'
          },
          Email: {
            type: 'string',
            format: 'email',
            description: 'Correo electrónico del usuario'
          },
          PasswordHash: {
            type: 'string',
            format: 'password',
            description: 'Hash de la contraseña del usuario'
          },
          CreatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Fecha de creación del usuario'
          }
        }
      },
      Login: {
        type: 'object',
        required: ['username', 'password'],
        properties: {
          username: {
            type: 'string',
            description: 'Nombre de usuario o correo electrónico'
          },
          password: {
            type: 'string',
            format: 'password',
            description: 'Contraseña del usuario'
          }
        }
      },
      TokenResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Indica si la operación fue exitosa'
          },
          message: {
            type: 'string',
            description: 'Mensaje informativo'
          },
          data: {
            type: 'object',
            properties: {
              token: {
                type: 'string',
                description: 'Token de autenticación'
              },
              user: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false
          },
          message: {
            type: 'string'
          },
          error: {
            type: 'string'
          }
        }
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

const options = {
  swaggerDefinition,
  apis: ['../routes/route.js']
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;