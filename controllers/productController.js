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
        res.render('./product.ejs');
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
        upload.single('img'), // Middleware para cargar una imagen
        async (req, res) => {
            const { name, price, discount, description, class: clase, sex, sizes } = req.body;
            // const productImage = req.file ? `/images/products/${req.file.filename}` : '';

            db.Product.create({
                name,
                price,
                discount,
                description,
                enOferta: 'true',
                img: req.file.filename || '',
                class: clase,
                sex,
                sizes
            })
                .then((result) => {
                    res.redirect('/product/creation');
                })
        }
    ],

    showEditById: (req, res) => {
        let producto = '';
        db.Product.findByPk(req.params.id)
            .then((result) => {
                producto = result;
                res.render('./product/productEditById', { producto });
            })
    },

    editById: [
        upload.single('img'), // Middleware para cargar una imagen
        async (req, res) => {
            let { name, price, discount, description, class: clase, sex, enOferta } = req.body;
            // const productImage = req.file ? `/images/products/${req.file.filename}` : '';

            if (enOferta != undefined) {
                enOferta = '1';
            }

            db.Product.findByPk(req.params.id)
                .then((result) => {
                    const productToUpdate = result;

                    name ? productToUpdate.name = name : productToUpdate.name;
                    price ? productToUpdate.price = price : productToUpdate.price;
                    discount ? productToUpdate.discount = discount : productToUpdate.discount;
                    description ? productToUpdate.description = description : productToUpdate.description;
                    req.file.filename ? productToUpdate.img = req.file.filename : productToUpdate.img;
                    clase ? productToUpdate.class = clase : productToUpdate.class;
                    sex ? productToUpdate.sex = sex : productToUpdate.sex;

                    db.Product.update({
                        name: productToUpdate.name,
                        price: productToUpdate.price,
                        discount: productToUpdate.discount,
                        description: productToUpdate.description,
                        enOferta: enOferta,
                        img: productToUpdate.img,
                        class: productToUpdate.class,
                        sex: productToUpdate.sex
                    }, {
                        where: { id: req.params.id }
                    }).then((result) => {
                        res.redirect('/');
                    })
                })
        }
    ],

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
    
                res.render('./product/product', { product });
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