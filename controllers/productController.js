const { body, validationResult } = require('express-validator');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('../dataBase/models');
const { Product } = require('../dataBase/models');


// Configuración de almacenamiento para la carga de imágenes con Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Ruta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único del archivo
    }
});

const upload = multer({ storage: storage });

const productController = {

    list: (req, res) => {
        res.render('./product.ejs', { product, userType: req.session.userType });
    },

    addToCart: async (req, res) => {
        const productId = parseInt(req.params.id, 10);

        try {
            // Busca el producto en la base de datos
            const product = await Product.findByPk(productId);

            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }

            // Obtiene o inicializa el carrito en la sesión
            req.session.cart = req.session.cart || [];

            // Agrega el producto al carrito en la sesión
            req.session.cart.push(product);

            // Redirige o renderiza la vista del carrito
            res.redirect('/product/cart'); // Cambia '/cart' por la ruta de tu vista del carrito
        } catch (error) {
            console.error('Error al agregar al carrito:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    removeFromCart: async (req, res) => {
        const productId = parseInt(req.params.id, 10);

        try {
            // Filtra los productos para quitar el que tenga el ID proporcionado
            req.session.cart = req.session.cart.filter((item) => item.id !== productId);

            // Redirige o renderiza la vista del carrito
            res.redirect('/product/cart'); // Cambia '/cart' por la ruta de tu vista del carrito
        } catch (error) {
            console.error('Error al quitar del carrito:', error);
            res.status(500).send('Error interno del servidor');
        }
    },

    cart: (req, res) => {
        // Renderiza la vista del carrito con los productos almacenados en la sesión
        res.render('./product/productCart', { data: req.session.cart });
    },

    creation: (req, res) => {
        res.render('./product/productCreation');
    },

    createProduct: [
        upload.array('img', 4),
        [
            body('name')
                .notEmpty().withMessage('El campo nombre del producto es obligatorio')
                .isLength({ min: 5 }).withMessage('El nombre del producto debe tener al menos 5 caracteres'),
    
            body('description')
                .isLength({ min: 20 }).withMessage('La descripción del producto debe tener al menos 20 caracteres'),
    
            body('img')
                .custom((value, { req }) => {
                    if (!req.files || req.files.length < 1) {
                        throw new Error('Se requiere al menos una imagen para el producto');
                    }
    
                    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
                    const fileExtension = req.files[0].originalname.split('.').pop().toLowerCase();
    
                    if (!allowedExtensions.includes(fileExtension)) {
                        throw new Error('El archivo de imagen debe ser JPG, JPEG, PNG, o GIF');
                    }
    
                    return true;
                }),
        ],
        async (req, res) => {
            const errors = validationResult(req);
    
            if (!errors.isEmpty()) {
                // Si hay errores de validación, pasa los errores y un mensaje adicional a la vista
                const errorMessage = 'Hay campos sin completar o con errores';
                return res.render('product/productCreation', { errors: errors.array(), errorMessage });
            }
    
            const { name, price, discount, description, class: clase, sex, sizes } = req.body;
    
            // Obtener los nombres de los archivos subidos
            const images = req.files.map(file => file.filename);
    
            try {
                // Resto del código para crear el producto en la base de datos
                const result = await db.Product.create({
                    name,
                    price,
                    discount,
                    description,
                    enOferta: 'true',
                    img: images[0] || '',
                    img2: images[1] || '',
                    img3: images[2] || '',
                    img4: images[3] || '',
                    class: clase,
                    sex,
                    sizes
                });
    
                console.log('Producto creado:', result);
                const productId = result.id;  // Obtener el ID del producto recién creado
                res.redirect(`/product/${productId}`);
            } catch (error) {
                // Manejar errores al crear el producto
                console.error('Error al crear el producto:', error);
                res.status(500).send('Error interno del servidor');
            }
        }
    ]
    ,

    showEditById: (req, res) => {
        let producto = '';
        db.Product.findByPk(req.params.id)
            .then((result) => {
                producto = result;
                res.render('./product/productEditById', { producto });
            })
    },

    doEditById: async (req, res) => {
    const { name, price, discount, description, class: clase, sizes } = req.body;
    const productId = req.params.id;

    try {
        const product = await db.Product.findByPk(productId);

        if (product) {
            console.log('Producto antes de la modificación:', product);

            // Actualizar la información del producto
            product.name = name;
            product.price = price;
            product.discount = discount;
            product.description = description;
            product.class = clase;
            product.sizes = sizes;

            // Actualizar la imagen del producto si se carga un nuevo archivo
            if (req.file) {
                const imagePath = path.join(__dirname, '../public/images', product.img);

                // Verificar que el archivo exista antes de intentar eliminarlo
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                    console.log('Imagen anterior eliminada:', product.img);
                }

                product.img = req.file.filename;
            }

            console.log('Producto después de la modificación:', product);

            await product.save();

            console.log('Producto actualizado:', product.id);
            res.redirect('/');
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al editar el producto:', error);
        res.status(500).send('Error interno del servidor');
    }
},

    catalogo: (req, res) => {
        db.Product.findAll()
        .then((results) => {
            res.render('./product/productCatalogue', { results })
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error interno del servidor');
        });
    },

    productDetail: (req, res) => {
        db.Product.findByPk(req.params.id)
            .then((product) => {
                if (!product) {
                    return res.status(404).send('Producto no encontrado');
                }
    
                // Asegúrate de pasar userType al renderizar la vista
                res.render('./product/product', { product, userType: req.session.userType });
            })
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error interno del servidor');
            });
    },

    productDelete: (req, res) => {
        db.Product.destroy({
            where: { id: req.params.id }
        })
            .then((result) => {
                res.redirect('/');
            });
    }
};

module.exports = productController;