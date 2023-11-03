// Importación del módulo Express y creación de un enrutador
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Importa el controlador de autenticación
const verificarAutenticacion = require('../middlewares/verificarAutenticacion');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Ruta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único del archivo
    }
});
const upload = multer({ storage: storage });

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
