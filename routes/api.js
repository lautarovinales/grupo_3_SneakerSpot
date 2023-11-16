const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const verificarAutenticacion = require('../middlewares/verificarAutenticacion');
const isAdmin = require('../middlewares/verificarAdmin'); // Importa el nuevo middleware

router.get('/users', apiController.getAllUsers);
router.get('/users/:id', apiController.getUserById);
router.get('/api/users/:id/image', apiController.getUserImageById);
router.get('/products', apiController.getAllProducts);
router.get('/products/:id', apiController.getProductById);
router.get('/categories', apiController.getAllCategories);
router.get('/categories/:id', apiController.getCategoryById);

module.exports = router;