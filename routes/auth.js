const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para mostrar la página de inicio de sesión
router.get('/login', authController.login);

// Ruta para mostrar la página de registro
router.get('/register', authController.register);

// Ruta para procesar el registro del usuario
router.post('/register', authController.doRegister);

// Ruta para procesar el inicio de sesión del usuario
router.post('/login', authController.doLogin);

module.exports = router;
