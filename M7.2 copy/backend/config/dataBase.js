const sql = require('mssql');
require('dotenv').config();

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: false,
    connectionTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

class DatabaseConnection {
  constructor() {
    this.pool = null;
    this.connected = false;
  }

  async connect() {
    if (this.connected && this.pool) {
      return this.pool;
    }

    try {
      this.pool = await new sql.ConnectionPool(dbSettings).connect();
      this.connected = true;
      console.log('Conexión a la base de datos establecida');
      return this.pool;
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error.message);
      throw new Error('No se pudo conectar a la base de datos');
    }
  }

  async executeQuery(query, params = {}) {
    try {
      const conn = await this.connect();
      const request = conn.request();
      
      Object.entries(params).forEach(([key, value]) => {
        request.input(key, value);
      });
      
      const result = await request.query(query);
      return result;
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error.message);
      throw new Error('Error al ejecutar la consulta en la base de datos');
    }
  }
}

module.exports = {
  db: new DatabaseConnection(),
  sql
};