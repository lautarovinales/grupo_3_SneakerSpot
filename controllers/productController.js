const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const db = require('../dataBase/models');
const { Product } = require('../dataBase/models');
const { Op } = require('sequelize');
const { Z_ASCII } = require('zlib');
const upload = require('../utils/multerConfig');

const productController = {

    list: (req, res) => {
        res.render('index', { productosEnOferta: results, userType: req.session.userType });
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
    doEditById: [
        [
            body('name')
                .notEmpty().withMessage('El campo nombre del producto es obligatorio')
                .isLength({ min: 5 }).withMessage('El nombre del producto debe tener al menos 5 caracteres'),

            body('description')
                .isLength({ min: 20 }).withMessage('La descripción del producto debe tener al menos 20 caracteres'),
        ],
        async (req, res) => {
            try {
                const producto = await db.Product.findByPk(req.params.id);

                if (!producto) {
                    console.log('Producto no encontrado');
                    return res.status(404).send('Producto no encontrado');
                }

                console.log('Producto encontrado:', producto);

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    console.log('Errores de validación:', errors.array());
                    return res.render('./product/productEditById', { errors: errors.array(), producto });
                }

                // Actualizamos los datos del producto
                const { name, price, discount, description, class: clase, sizes } = req.body;
                producto.name = name;
                producto.price = price;
                producto.discount = discount;
                producto.description = description;
                producto.class = clase;
                producto.sizes = sizes;

                // Verificamos si hay una nueva imagen
                if (req.file) {
                    const imagePath = path.join(__dirname, '../public/images', producto.img);

                    // Eliminamos la imagen anterior
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                        console.log('Imagen anterior eliminada:', producto.img);
                    }

                    // Asignamos la nueva imagen al producto
                    producto.img = req.file.filename;
                }

                // Guardamos los cambios
                await producto.save();

                console.log('Producto actualizado:', producto.id);
                res.redirect('/');
            } catch (error) {
                console.error('Error al editar el producto:', error);
                res.status(500).send('Error interno del servidor');
            }
        }
    ],
    catalogo: async (req, res) => {
        try {
            let results;
    
            if (req.query.talla) {
                results = await db.Product.findAll({
                    where: {
                        sizes: {
                            [Op.like]: `%${req.query.talla}%`
                        }
                    }
                });
            } else if (req.query.class) { // Agregar condición para filtrar por clase
                results = await db.Product.findAll({
                    where: {
                        class: {
                            [Op.like]: `%${req.query.class}%`
                        }
                    }
                });
            } else if (req.query.gender) {
                results = await db.Product.findAll({
                  where: {
                    sex: req.query.gender // Buscar directamente el valor del parámetro
                  }
                });
            } else {
                results = await db.Product.findAll();
            }
    
            res.render('./product/productCatalogue', { results });
        } catch (error) {
            console.error('Error en la función catalogo:', error);
            res.status(500).send('Error interno del servidor');
        }
    },
    search: async (req, res) => {
        const query = req.query.query;
    
        try {
            // Realiza una búsqueda en la base de datos con Sequelize
            const resultsSearch = await db.Product.findAll({
                where: {
                    name: { [Op.like]: `%${query}%` },
                },
            });
    
            console.log('Resultados de búsqueda:', resultsSearch);
            res.render('./product/searchResults', { resultsSearch });
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error.message);
            res.status(500).send(`Error interno del servidor: ${error.message}`);
        }
    },

    productDetail: (req, res) => {
        db.Product.findByPk(req.params.id)
            .then((product) => {
                if (!product) {
                    const errorp = "Error al obtener el Producto";
            const errorpDesc = "Hubo un problema al intentar obtener el detalle de producto. Por favor, intentalo de nuevo más tarde";
            res.render('error', { errorp, errorpDesc } );
                }

                // Asegúrate de pasar userType al renderizar la vista
                res.render('./product/product', { product, userType: req.session.userType });
            })
    },

    productDelete: (req, res) => {
        db.Product.destroy({
            where: { id: req.params.id }
        })
            .then((result) => {
                res.redirect('/');
            });
    },


};



module.exports = productController;