const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const verificarAutenticacion = require('../middlewares/verificarAutenticacion');
const isAdmin = require('../middlewares/verificarAdmin'); // Importa el nuevo middleware

router.get('/users', verificarAutenticacion, isAdmin, apiController.getAllUsers);
router.get('/users/:id', verificarAutenticacion, isAdmin, apiController.getUserById);
router.get('/api/users/:id/image', apiController.getUserImageById);
router.get('/product', verificarAutenticacion, isAdmin, apiController.getAllProducts);
router.get('/product/:id', verificarAutenticacion, isAdmin, apiController.getProductById);

module.exports = router;