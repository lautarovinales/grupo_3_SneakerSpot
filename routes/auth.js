// Importación del módulo Express y creación de un enrutador
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Importa el controlador de autenticación
const verificarAutenticacion = require('../middlewares/verificarAutenticacion');

// Ruta para mostrar la página de inicio de sesión
// Ruta: /login
// Método: GET
// Controlador: authController.login
router.get('/login', authController.login);

router.get('/profile', verificarAutenticacion, authController.profile);

// Ruta para mostrar la página de registro
// Ruta: /register
// Método: GET
// Controlador: authController.register
router.get('/register', authController.register);

// Ruta para procesar el registro del usuario
// Ruta: /register
// Método: POST
// Controlador: authController.doRegister
router.post('/register', authController.doRegister);

// Ruta para procesar el inicio de sesión del usuario
// Ruta: /login
// Método: POST
// Controlador: authController.doLogin
router.post('/login', authController.doLogin);

router.post('/logout', authController.doLogout);

// Exporta el enrutador para que pueda ser utilizado en otros archivos
module.exports = router;
