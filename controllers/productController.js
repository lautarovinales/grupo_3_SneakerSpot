// Importación de módulos necesarios
const path = require('path'); // Módulo para manejar rutas de archivos y directorios
const dataBase = require('../dataBase/productList.json'); // Importa los datos desde productList.json
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Ruta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único del archivo
    }
});

const upload = multer({ storage: storage });

// Definición del controlador de productos
const productController = {
    // Método para listar productos
    list: (req, res) => {
        // Envía el archivo product.ejs al cliente como respuesta
        res.sendFile(path.resolve(__dirname, '../views/product.ejs'));
    },
    cart: (req, res) => {
        res.render('./product/productCart', { data: dataBase.results });
    },
    creation: (req, res) => {
        res.render('./product/productCreation');
    },
    createProduct: [
        upload.single('img'),
        (req, res) => {
            try {
                const { title, clase, history, discount, price, stock } = req.body;
                const productImage = req.file;

                const imagePath = productImage ? `/images/${productImage.filename}` : '';

                // Fija el id del nuevo producto
                const newProductId = dataBase.results.length > 0 ? parseInt(dataBase.results[dataBase.results.length - 1].id) + 1 : 1;

                const newProduct = {
                    id: newProductId.toString(), // Convertir de nuevo a cadena si es necesario
                    title,
                    clase,
                    history,
                    discount,
                    price,
                    stock,
                    image: imagePath
                };

                dataBase.results.push(newProduct);

                fs.writeFileSync(path.join(__dirname, '../dataBase/productList.json'), JSON.stringify(dataBase, null, 4));

                res.redirect('/product/creation');
            } catch (error) {
                console.error(error);
                res.status(500).send('Error al crear el producto');
            }
        }
    ],

    showEditById: (req, res) => {
        const id = req.params.id;
        const { results } = dataBase;
        const producto = results.find(pro => pro.id == id);
        res.render('./product/productEditById', { producto });
    },

    editById: [upload.single('img'), async (req, res) => {
        const { title, class: clase, price, discount, img, history } = req.body;
        const id = req.params.id;

        const productImage = req.file;
        const imagePath = productImage ? `/images/${productImage.filename}` : '';

        const { results } = dataBase;

        const foundById = results.find((pro) => pro.id === id);

        title ? foundById.title = title : foundById.title
        clase ? foundById.class = clase : foundById.class
        price ? foundById.price = price : foundById.price
        discount ? foundById.discount = discount : foundById.discount
        history ? foundById.history = history : foundById.history
        imagePath ? foundById.img = imagePath : foundById.img

        //1ro eliminamos el producto original
        const productos = results.filter(pro => pro.id != foundById.id);

        //2do agregamos el producto "nuevo" y ordenamos los objetos en base a su id
        productos.push(foundById);
        productos.sort((a, b) => a.id > b.id ? 1 : -1);

        fs.writeFileSync(path.join(__dirname, '../dataBase/productList.json'), JSON.stringify(dataBase, null, 4));

        res.redirect('/');
    }],

    catalogo: (req, res) => {
        res.render('./product/productCatalogue');
    },

    // Método para mostrar detalles de un producto
    productDetail: (req, res) => {
        const { id } = req.params;
        const { results } = dataBase;
        const product = results.find(prod => prod.id === id);

        // Renderiza la vista 'product' utilizando el motor de plantillas EJS
        res.render('./product/product', { product });
    }
};

// Exporta el controlador de productos para que pueda ser utilizado en otros archivos
module.exports = productController;