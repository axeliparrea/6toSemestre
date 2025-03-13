require('dotenv').config();
const app = require('./app');

const PORT = process.env.BACK_PORT || 3000; 

process.on('uncaughtException', (err) => {
  console.error('ERROR NO CAPTURADO. Cerrando aplicación...');
  console.error('Error:', err.name, err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  const mode = process.env.NODE_ENV || 'development';
  console.log('===================================');
  console.log('Servidor iniciado en modo:', mode);
  console.log('Escuchando en el puerto:', PORT);
  console.log('Documentación: http://localhost:' + PORT + '/api-docs');
  console.log('===================================');
});

process.on('unhandledRejection', (err) => {
  console.error('RECHAZO DE PROMESA NO MANEJADO. Cerrando aplicación...');
  console.error('Error:', err.name, err.message);
  console.error('Stack:', err.stack);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('Señal SIGTERM recibida. Cerrando servidor...');
  server.close(() => {
    console.log('Proceso terminado correctamente');
  });
});
