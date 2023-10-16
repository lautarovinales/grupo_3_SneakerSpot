const path = require('path');
const dataBase = require('../dataBase/productList.json');
const dataCart = require('../dataBase/productListCart.json');
const multer = require('multer');
const fs = require('fs');
const db = require('../dataBase/models');

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
        // Envía el archivo product.ejs al cliente como respuesta
        // res.sendFile(path.resolve(__dirname, '../views/product.ejs'));
        res.render('./product.ejs');
    },

    cart: (req, res) => {
        res.render('./product/productCart', { data: dataCart.results });
    },

    addToCart: async (req, res) => {
        const cart = dataCart.results;
        const { results } = dataBase;
        const product = results.find((pro) => pro.id === req.params.id);
        cart.push(product);
        fs.writeFileSync(path.join(__dirname, '../dataBase/productListCart.json'), JSON.stringify(dataCart, null, 4));
        res.render('./product/productCart', { data: dataCart.results });
    },

    creation: (req, res) => {
        res.render('./product/productCreation');
    },

    createProduct: [
        upload.single('img'), // Middleware para cargar una imagen
        async (req, res) => {
            const { name, price, discount, description, class: clase, sex } = req.body;
            const productImage = req.file ? `/images/products/${req.file.filename}` : '';
            db.Product.create({
                name,
                price,
                discount,
                description,
                enOferta: 'true',
                img: productImage || '',
                class: clase,
                sex
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
            const { name, price, discount, description, class: clase, sex } = req.body;
            const productImage = req.file ? `/images/products/${req.file.filename}` : '';

            db.Product.findByPk(req.params.id)
                .then((result) => {
                    const productToUpdate = result;

                    name ? productToUpdate.name = name : productToUpdate.name;
                    price ? productToUpdate.price = price : productToUpdate.price;
                    discount ? productToUpdate.discount = discount : productToUpdate.discount;
                    description ? productToUpdate.description = description : productToUpdate.description;
                    productImage ? productToUpdate.img = productImage : productToUpdate.img;
                    clase ? productToUpdate.class = clase : productToUpdate.class;
                    sex ? productToUpdate.sex = sex : productToUpdate.sex;

                    db.Product.update({
                        name,
                        price,
                        discount,
                        description,
                        img: productImage || '',
                        class: clase,
                        sex
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
    },

    productDetail: (req, res) => {
        db.Product.findByPk(req.params.id)
            .then((result) => {
                res.render('./product/product', { product: result })
            })
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