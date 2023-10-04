// Importación del módulo Express y creación de un enrutador
const express = require('express'); // Importa el módulo Express
const router = express.Router(); // Crea un enrutador utilizando Express
const methodOverride = require('method-override');
const productController = require('../controllers/productController'); // Importa el controlador de productos
const verificarAutenticacion = require('../middlewares/verificarAutenticacion');

// Configura el método para sobrescribir la solicitud DELETE
router.use(methodOverride('_method'));

router.get('/', productController.list);

router.get('/cart', verificarAutenticacion, productController.cart);

router.get('/creation', verificarAutenticacion, productController.creation);

router.post('/creation', productController.createProduct);

router.get('/catalogo', productController.catalogo);

router.get('/edit/:id', verificarAutenticacion, productController.showEditById);

router.put('/edit/:id', productController.editById);

router.get('/:id', productController.productDetail);

router.delete('/:id', productController.productDelete);

// Exporta el enrutador para que pueda ser utilizado en otros archivos
module.exports = router;