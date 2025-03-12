const { db, sql } = require('../config/dataBase');

class UserController {
  async getAll(req, res) {
    try {
      const queryResult = await db.executeQuery(`
        SELECT id, username, email, 
               CONVERT(VARCHAR, created_at, 120) AS created_at 
        FROM users 
        ORDER BY id ASC
      `);
      
      return res.status(200).json({
        success: true,
        count: queryResult.recordset.length,
        data: queryResult.recordset
      });
    } catch (error) {
      console.error('Error en getAll:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios',
        error: error.message
      });
    }
  }

  async getById(req, res) {
    try {
      const userId = req.params.id;
      
      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
      }
      
      const queryResult = await db.executeQuery(`
        SELECT id, username, email, 
               CONVERT(VARCHAR, created_at, 120) AS created_at 
        FROM users 
        WHERE id = @userId
      `, { userId: sql.Int, userId });
      
      if (queryResult.recordset.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: queryResult.recordset[0]
      });
    } catch (error) {
      console.error('Error en getById:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el usuario',
        error: error.message
      });
    }
  }

  async create(req, res) {
    try {
      const { username, email, password, fullname } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Datos incompletos. Se requiere username, email y password'
        });
      }
      
      const checkExisting = await db.executeQuery(`
        SELECT COUNT(*) AS count FROM users 
        WHERE username = @username OR email = @email
      `, { 
        username: sql.VarChar(100), username,
        email: sql.VarChar(150), email 
      });
      
      if (checkExisting.recordset[0].count > 0) {
        return res.status(409).json({
          success: false,
          message: 'El nombre de usuario o email ya está en uso'
        });
      }
      
      const insertResult = await db.executeQuery(`
        INSERT INTO users (username, email, password, fullname, created_at)
        VALUES (@username, @email, @password, @fullname, GETDATE());
        
        SELECT SCOPE_IDENTITY() AS newId;
      `, {
        username: sql.VarChar(100), username,
        email: sql.VarChar(150), email,
        password: sql.VarChar(200), password,
        fullname: { type: sql.NVarChar(200), value: fullname || null }
    });
    
      
      const newUserId = insertResult.recordset[0].newId;
      
      // Obtener el usuario creado
      const newUser = await db.executeQuery(`
        SELECT id, username, email, fullname, 
               CONVERT(VARCHAR, created_at, 120) AS created_at 
        FROM users 
        WHERE id = @id
      `, { id: sql.Int, newUserId });
      
      return res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: newUser.recordset[0]
      });
    } catch (error) {
      console.error('Error en create:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear el usuario',
        error: error.message
      });
    }
  }

  async update(req, res) {
    try {
      const userId = req.params.id;
      const { username, email, password, fullname } = req.body;
      
      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
      }
      
      const userExists = await db.executeQuery(`
        SELECT COUNT(*) AS count FROM users WHERE id = @userId
      `, { userId: sql.Int, userId });
      
      if (userExists.recordset[0].count === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      let updateFields = [];
      const params = { userId: sql.Int, userId };
      
      if (username) {
        updateFields.push('username = @username');
        params.username = { type: sql.VarChar(100), value: username };
      }
      
      if (email) {
        updateFields.push('email = @email');
        params.email = { type: sql.VarChar(150), value: email };
      }
      
      if (password) {
        updateFields.push('password = @password');
        params.password = { type: sql.VarChar(200), value: password };
      }
      
      if (fullname) {
        updateFields.push('fullname = @fullname');
        params.fullname = { type: sql.NVarChar(200), value: fullname };
      }
      
      if (updateFields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No se proporcionaron campos para actualizar'
        });
      }
      
      await db.executeQuery(`
        UPDATE users 
        SET ${updateFields.join(', ')} 
        WHERE id = @userId
      `, params);
      
      const updatedUser = await db.executeQuery(`
        SELECT id, username, email, fullname, 
               CONVERT(VARCHAR, created_at, 120) AS created_at 
        FROM users 
        WHERE id = @userId
      `, { userId: sql.Int, userId });
      
      return res.status(200).json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: updatedUser.recordset[0]
      });
    } catch (error) {
      console.error('Error en update:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar el usuario',
        error: error.message
      });
    }
  }

  async delete(req, res) {
    try {
      const userId = req.params.id;
      
      if (!userId || isNaN(userId)) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
      }
      
      const userExists = await db.executeQuery(`
        SELECT COUNT(*) AS count FROM users WHERE id = @userId
      `, { userId: sql.Int, userId });
      
      if (userExists.recordset[0].count === 0) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }
      
      await db.executeQuery(`
        DELETE FROM users WHERE id = @userId
      `, { userId: sql.Int, userId });
      
      return res.status(200).json({
        success: true,
        message: 'Usuario eliminado correctamente',
        data: { id: parseInt(userId) }
      });
    } catch (error) {
      console.error('Error en delete:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar el usuario',
        error: error.message
      });
    }
  }
}

module.exports = new UserController();