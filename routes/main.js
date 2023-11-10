// Importación del módulo Express y creación de un enrutador
const express = require('express'); // Importa el módulo Express
const router = express.Router(); // Crea un enrutador utilizando Express

// Importación del controlador principal
const mainController = require('../controllers/mainController'); // Importa el controlador principal

router.get('/', mainController.home);
router.get('/error', mainController.error);

// Exporta el enrutador para que pueda ser utilizado en otros archivos
module.exports = router;
