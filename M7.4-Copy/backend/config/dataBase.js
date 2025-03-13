const sql = require('mssql');
require('dotenv').config();

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectionTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

const poolPromise = new sql.ConnectionPool(dbSettings)
  .connect()
  .then(pool => {
    console.log('Conexión a la base de datos establecida');
    return pool;
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err.message);
    throw new Error('No se pudo conectar a la base de datos');
  });

module.exports = {
  sql,
  poolPromise
};
