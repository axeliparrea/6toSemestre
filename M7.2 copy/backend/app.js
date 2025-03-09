const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagg/swagger');
const routes = require('./routes/route');
const { poolPromise } = require('./config/dataBase'); 

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

poolPromise
  .then(pool => console.log('Conexión a la base de datos establecida correctamente'))
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err.message);
    process.exit(1);
  });

app.use('/api', routes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API de Usuarios - Documentación"
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenido a la API de Gestión de Usuarios',
    version: '1.0.0',
    documentation: '/api-docs',
    status: 'online'
  });
});

app.use((err, req, res, next) => {
  console.error('Error no controlado:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error inesperado'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

module.exports = app;
