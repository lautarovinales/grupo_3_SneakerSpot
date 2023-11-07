const express = require('express');
const router = express.Router();
const methodOverride = require('method-override');
const productController = require('../controllers/productController');
const verificarAutenticacion = require('../middlewares/verificarAutenticacion');
const isAdmin = require('../middlewares/verificarAdmin'); // Importa el nuevo middleware
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

router.use(methodOverride('_method'));

router.get('/', productController.list);

router.get('/cart', verificarAutenticacion, productController.cart);

router.get('/creation', verificarAutenticacion, isAdmin, productController.creation);

router.post('/creation', productController.createProduct);

router.get('/catalogo', productController.catalogo);

router.get('/edit/:id', verificarAutenticacion, isAdmin, productController.showEditById);

router.post('/edit/:id',upload.single('img'), productController.doEditById);

router.get('/:id', productController.productDetail);

router.post('/:id/addToCart', productController.addToCart);

router.post('/:id/removeFromCart', productController.removeFromCart);

router.post('/:id/delete',verificarAutenticacion, isAdmin, productController.productDelete);

module.exports = router;