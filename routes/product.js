const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const productController = require('../controllers/productController');
const verificarAutenticacion = require('../middlewares/verificarAutenticacion');
const isAdmin = require('../middlewares/verificarAdmin'); // Importa el nuevo middleware

router.use(methodOverride('_method'));

router.get('/', productController.list);

router.get('/cart', verificarAutenticacion, productController.cart);

router.get('/creation', verificarAutenticacion, isAdmin, productController.creation);

router.post('/creation', productController.createProduct);

router.get('/catalogo', productController.catalogo);

router.get('/edit/:id', verificarAutenticacion, isAdmin, productController.showEditById);

router.put('/edit/:id', productController.editById);

router.get('/:id', productController.productDetail);

router.post('/:id/addToCart', productController.addToCart);

router.post('/:id/removeFromCart', productController.removeFromCart);

module.exports = router;