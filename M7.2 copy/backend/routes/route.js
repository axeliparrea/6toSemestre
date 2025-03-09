const express = require('express');
const router = express.Router();
const userController = require('../controller/controllers');

// Rutas para usuarios
router.post('/users/register', (req, res) => userController.registerUser(req, res));
router.post('/users/login', (req, res) => userController.loginUser(req, res));
router.get('/users/getUsers', (req, res) => userController.getUsers(req, res));
router.put('/users/updateUser/:id', (req, res) => userController.updateUser(req, res));
router.delete('/users/deleteUser/:id', (req, res) => userController.deleteUser(req, res));

// Ruta de salud
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
