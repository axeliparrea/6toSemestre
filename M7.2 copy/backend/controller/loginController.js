const { db, sql } = require('../config/dataBase');
const crypto = require('crypto');

class AuthController {
  // Método para autenticación de usuarios
  async login(req, res) {
    try {
      const { username, password } = req.body;
      
      // Validación de campos
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere nombre de usuario y contraseña'
        });
      }
      
      // Consulta para verificar credenciales
      const queryResult = await db.executeQuery(`
        SELECT id, username, email, fullname,
               CONVERT(VARCHAR, created_at, 120) AS created_at
        FROM users
        WHERE (username = @username OR email = @username)
          AND password = @password
      `, {
        username: sql.VarChar(150), username,
        password: sql.VarChar(200), password
      });
      
      // Si no se encuentra el usuario o contraseña incorrecta
      if (queryResult.recordset.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
      }
      
      const user = queryResult.recordset[0];
      
      // Generar token de sesión
      // En producción se usaría JWT, pero para simplificar usamos esto
      const sessionData = {
        userId: user.id,
        username: user.username,
        timestamp: new Date().getTime(),
        random: crypto.randomBytes(16).toString('hex')
      };
      
      const token = Buffer.from(JSON.stringify(sessionData)).toString('base64');
      
      // Registrar el token en la base de datos (en producción)
      /* await db.executeQuery(`
        INSERT INTO user_sessions (user_id, token, created_at, expires_at)
        VALUES (@userId, @token, GETDATE(), DATEADD(hour, 24, GETDATE()))
      `, {
        userId: sql.Int, user.id,
        token: sql.VarChar(500), token
      }); */
      
      return res.status(200).json({
        success: true,
        message: 'Autenticación exitosa',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            fullname: user.fullname,
            created_at: user.created_at
          }
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      return res.status(500).json({
        success: false,
        message: 'Error en el proceso de autenticación',
        error: error.message
      });
    }
  }
  
  // Verificar token de sesión
  async verifyToken(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }
      
      try {
        // Decodificar el token
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
        
        // Verificar campos necesarios
        if (!tokenData.userId || !tokenData.username || !tokenData.timestamp) {
          throw new Error('Token malformado');
        }
        
        // Verificar expiración (24 horas)
        const expirationTime = tokenData.timestamp + (24 * 60 * 60 * 1000);
        if (Date.now() > expirationTime) {
          return res.status(401).json({
            success: false,
            message: 'Token expirado'
          });
        }
        
        // Verificar que el usuario existe
        const userExists = await db.executeQuery(`
            SELECT id, username FROM users WHERE id = @userId AND username = @username
          `, {
            userId: { type: sql.Int, value: tokenData.userId },
            username: { type: sql.VarChar(100), value: tokenData.username }
          });
          
        
        if (userExists.recordset.length === 0) {
          return res.status(401).json({
            success: false,
            message: 'Token inválido - usuario no encontrado'
          });
        }
        
        return res.status(200).json({
          success: true,
          message: 'Token válido',
          data: {
            userId: tokenData.userId,
            username: tokenData.username,
            expiresAt: new Date(expirationTime).toISOString()
          }
        });
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Token inválido o malformado',
          error: error.message
        });
      }
    } catch (error) {
      console.error('Error en verifyToken:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al verificar el token',
        error: error.message
      });
    }
  }
  
  // Cerrar sesión (invalidar token)
  async logout(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token no proporcionado'
        });
      }
      
      // En una implementación real, aquí invalidaríamos el token
      // Por ejemplo, agregándolo a una lista negra en la base de datos
      
      /* await db.executeQuery(`
        UPDATE user_sessions 
        SET revoked = 1, revoked_at = GETDATE() 
        WHERE token = @token
      `, {
        token: sql.VarChar(500), token
      }); */
      
      return res.status(200).json({
        success: true,
        message: 'Sesión cerrada correctamente'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión',
        error: error.message
      });
    }
  }
  
  // Cambiar contraseña
  async changePassword(req, res) {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      
      if (!userId || !currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Se requieren todos los campos'
        });
      }
      
      // Verificar contraseña actual
      const verifyPassword = await db.executeQuery(`
        SELECT COUNT(*) AS count FROM users 
        WHERE id = @userId AND password = @currentPassword
      `, {
        userId: sql.Int, userId,
        currentPassword: sql.VarChar(200), currentPassword
      });
      
      if (verifyPassword.recordset[0].count === 0) {
        return res.status(401).json({
          success: false,
          message: 'Contraseña actual incorrecta'
        });
      }
      
      // Actualizar contraseña
      await db.executeQuery(`
        UPDATE users 
        SET password = @newPassword 
        WHERE id = @userId
      `, {
        userId: sql.Int, userId,
        newPassword: sql.VarChar(200), newPassword
      });
      
      return res.status(200).json({
        success: true,
        message: 'Contraseña actualizada correctamente'
      });
    } catch (error) {
      console.error('Error en changePassword:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar la contraseña',
        error: error.message
      });
    }
  }
}

module.exports = new AuthController();