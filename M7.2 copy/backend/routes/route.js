const express = require('express');
const router = express.Router();
const userController = require('../controller/controllers');
const authController = require('../controller/loginController');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado - Token requerido'
      });
    }
    
    try {
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      const expirationTime = tokenData.timestamp + (24 * 60 * 60 * 1000);
      if (Date.now() > expirationTime) {
        return res.status(401).json({
          success: false,
          message: 'Acceso no autorizado - Token expirado'
        });
      }
      
      req.user = {
        id: tokenData.userId,
        username: tokenData.username
      };
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Acceso no autorizado - Token inválido',
        error: error.message
      });
    }
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

router.post('/login', authController.login);
router.post('/login/verify', authController.verifyToken);
router.post('/login/logout', authController.logout);

router.get('/users', userController.getAll);
router.get('/users/:id', userController.getById);
router.post('/users', userController.create);
router.put('/users/:id', authenticateToken, userController.update);
router.delete('/users/:id', authenticateToken, userController.delete);

router.post('/change-password', authenticateToken, authController.changePassword);

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API functioning correctly',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;