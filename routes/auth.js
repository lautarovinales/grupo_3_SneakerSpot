// Importación del módulo Express y creación de un enrutador
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Importa el controlador de autenticación
const verificarAutenticacion = require('../middlewares/verificarAutenticacion');
const multer = require('multer');
const apiController = require('../controllers/apiController');
const upload = require('../utils/multerConfig');

router.get('/login', authController.login);

router.get('/profile', verificarAutenticacion, authController.profile);

router.get('/register', authController.register);

router.get('/edit-profile', verificarAutenticacion, authController.editProfile);

router.post('/register', upload.single('img'), authController.doRegister);

router.post('/login', authController.doLogin);

router.post('/logout', authController.doLogout);

router.post('/edit-profile', upload.single('img'), authController.doEditProfile);

// Exporta el enrutador para que pueda ser utilizado en otros archivos
module.exports = router;
