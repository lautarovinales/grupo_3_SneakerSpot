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
            const { name, price, discount, description, class: clase, sex} = req.body;
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
            const { name, price, discount, description, class: clase, sex} = req.body;
            const productImage = req.file ? `/images/products/${req.file.filename}` : '';

            db.Product.findByPk(req.params.id)
                .then((result) => {
                    const productToUpdate = result;
                })

            name ? productToUpdate.name = name : productToUpdate.name;
            price ? productToUpdate.price = price : productToUpdate.price;
            discount ? productToUpdate.discount = discount : productToUpdate.discount;
            description ? productToUpdate.description = description : productToUpdate.description;
            productImage ? productToUpdate.img = productImage : productToUpdate.img;
            clase ? productToUpdate.class = clase : productToUpdate.class;
            sex ? productToUpdate.sex = sex : productToUpdate.sex;

            db.Product.Update({
                name,
                price,
                discount,
                description,
                img: productImage || '',
                class: clase,
                sex
            })
                .then((result) => {
                    res.redirect('/');
                })


            // const { title, class: clase, price, discount, img, history } = req.body;
            // const id = req.params.id;

            // const productImage = req.file;
            // const imagePath = productImage ? `/images/products/${productImage.filename}` : '';

            // const { results } = dataBase;

            // // Encuentra el producto por su ID
            // const foundById = results.find((pro) => pro.id === id);

            // // Actualiza los campos del producto con los nuevos valores si están presentes en la solicitud
            // title ? foundById.title = title : foundById.title;
            // clase ? foundById.class = clase : foundById.class;
            // price ? foundById.price = price : foundById.price;
            // discount ? foundById.discount = discount : foundById.discount;
            // history ? foundById.history = history : foundById.history;
            // imagePath ? foundById.img = imagePath : foundById.img;

            // // Filtra los productos para eliminar el producto original y agrega el producto editado
            // // const productos = results.filter(pro => pro.id != foundById.id);
            // // productos.push(foundById);

            // // Ordena los objetos en base a su ID
            // // productos.sort((a, b) => a.id > b.id ? 1 : -1);

            // // Escribe los cambios en el archivo JSON
            // fs.writeFileSync(path.join(__dirname, '../dataBase/productList.json'), JSON.stringify(dataBase, null, 4));

            // res.redirect('/'); // Redirige después de editar el producto
        }
    ],

    catalogo: (req, res) => {
        db.Product.findAll()
            .then((results) => {
                res.render('./product/productCatalogue', {results})
            })
    },

    productDetail: (req, res) => {
        db.Product.findByPk(req.params.id)
            .then((result) => {
                res.render('./product/product', {product: result})
            })
    },

    productDelete: (req, res) => {
        const id = req.params.id; // Obtén el ID del parámetro de la solicitud

        // Encuentra el índice del producto a eliminar en el array 'results'
        const productIndex = dataBase.results.findIndex(product => product.id === id);

        if (productIndex !== -1) {
            // Elimina el producto del array
            dataBase.results.splice(productIndex, 1);

            // Ruta al archivo JSON de la base de datos
            const dbFilePath = path.join(__dirname, '../dataBase/productList.json');

            // Escribe los cambios de vuelta al archivo JSON
            fs.writeFileSync(dbFilePath, JSON.stringify(dataBase, null, 4));
        }

        res.redirect('/'); // Redirige a la página principal o a otra página según tu necesidad
    }
};

// Exporta el controlador de productos para que pueda ser utilizado en otros archivos
module.exports = productController;
