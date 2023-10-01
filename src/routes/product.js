const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const productController = require('../controllers/productController');

router.use(methodOverride('_method'));

router.get('/', productController.list);

router.get('/cart', productController.cart);

router.get('/creation', productController.creation);

router.post('/creation', productController.createProduct);

router.get('/catalogo', productController.catalogo);

router.get('/edit/:id', productController.showEditById);

router.put('/edit/:id', productController.editById);

router.get('/:id', productController.productDetail);

router.delete('/:id', productController.productDelete);

module.exports = router;