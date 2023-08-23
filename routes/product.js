// Importación del módulo Express y creación de un enrutador
const express = require('express'); // Importa el módulo Express
const router = express.Router(); // Crea un enrutador utilizando Express
const methodOverride = require('method-override');
const productController = require('../controllers/productController'); // Importa el controlador de productos

// Configura el método para sobrescribir la solicitud DELETE
router.use(methodOverride('_method'));

// Definición de las rutas y sus controladores
// Ruta: /
// Método: GET
// Controlador: productController.list
router.get('/', productController.list);

// Ruta: /cart
// Método: GET
// Controlador: productController.cart
router.get('/cart', productController.cart);

// Ruta: /creation
// Método: GET
// Controlador: productController.creation
router.get('/creation', productController.creation);

// Ruta: /creation
// Método: POST
// Controlador: productController.createProduct
router.post('/creation', productController.createProduct);

// Ruta: /catalogo
// Método: GET
// Controlador: productController.catalogo
router.get('/catalogo', productController.catalogo);

// Ruta: /edit/:id
// Método: GET
// Controlador: productController.showEditById
router.get('/edit/:id', productController.showEditById);

// Ruta: /edit/:id
// Método: PUT
// Controlador: productController.editById
router.put('/edit/:id', productController.editById);

// Ruta: /:id
// Método: GET
// Controlador: productController.productDetail
router.get('/:id', productController.productDetail);

// Ruta: /:id
// Método: DELETE
// Controlador: productController.productDelete
router.delete('/:id', productController.productDelete);

// Exporta el enrutador para que pueda ser utilizado en otros archivos
module.exports = router;
