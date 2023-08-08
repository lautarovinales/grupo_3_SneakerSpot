// Importación del módulo Express y creación de un enrutador
const express = require('express'); // Importa el módulo Express
const router = express.Router(); // Crea un enrutador utilizando Express

// Importación del controlador de productos
const productController = require('../controllers/productController'); // Importa el controlador de productos

// Definición de las rutas y sus controladores
router.get('/', productController.list); // Cuando se reciba una solicitud GET en la ruta '/', se llama a productController.list

// Definición de la ruta para ver detalles de un producto por ID
router.get('/:id', productController.productDetail); // Cuando se reciba una solicitud GET en la ruta '/:id', se llama a productController.productDetail

// Exporta el enrutador para que pueda ser utilizado en otros archivos
module.exports = router;
