// Importación de módulos necesarios
const path = require('path'); // Módulo para manejar rutas de archivos y directorios
const dataBase = require('../dataBase/productList.json'); // Importa los datos desde productList.json
const dataCart = require('../dataBase/productListCart.json'); // Importa los datos del carrito
const multer = require('multer'); // Módulo para manejar la carga de archivos
const fs = require('fs'); // Módulo para manejar el sistema de archivos

// Configuración de almacenamiento para la carga de imágenes con Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Ruta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único del archivo
    }
});

const upload = multer({ storage: storage }); // Crea un middleware de carga con la configuración de almacenamiento

// Definición del controlador de productos
const productController = {
    // Método para listar productos
    list: (req, res) => {
        // Envía el archivo product.ejs al cliente como respuesta
        res.sendFile(path.resolve(__dirname, '../views/product.ejs'));
    },
    // Método para mostrar el carrito de compras
    cart: (req, res) => {
        const { productCart } = dataCart;
        res.render('./product/productCart', { data: dataCart.results });
    },
    // Método para mostrar la página de creación de productos
    creation: (req, res) => {
        res.render('./product/productCreation');
    },
    // Método para crear un nuevo producto
    createProduct: [
        upload.single('img'), // Middleware para cargar una imagen
        async (req, res) => {
                const { title, class: clase, history, discount, price } = req.body;
                const productImage = req.file;

                // Construye la ruta de la imagen si se ha cargado
                const imagePath = productImage ? `/images/${productImage.filename}` : '';

                // Genera un nuevo ID para el producto
                const newProductId = dataBase.results.length > 0 ? parseInt(dataBase.results[dataBase.results.length - 1].id) + 1 : 1;

                // Crea un nuevo objeto de producto
                const newProduct = {
                    id: newProductId.toString(),
                    title,
                    class: clase,
                    history,
                    discount,
                    price,
                    img: imagePath,
                    enOferta: "true",
                };

                // Agrega el nuevo producto a la base de datos
                dataBase.results.push(newProduct);

                // Escribe los cambios en el archivo JSON
                fs.writeFileSync(path.join(__dirname, '../dataBase/productList.json'), JSON.stringify(dataBase, null, 4));

                res.redirect('/product/creation'); // Redirige después de crear el producto
        }
    ],
    // Método para mostrar la página de edición de un producto por su ID
    showEditById: (req, res) => {
        const id = req.params.id;
        const { results } = dataBase;
        const producto = results.find(pro => pro.id == id);
        res.render('./product/productEditById', { producto });
    },
    // Método para editar un producto por su ID
    editById: [
        upload.single('img'), // Middleware para cargar una imagen
        async (req, res) => {
            const { title, class: clase, price, discount, img, history } = req.body;
            const id = req.params.id;

            const productImage = req.file;
            const imagePath = productImage ? `/images/${productImage.filename}` : '';

            const { results } = dataBase;

            // Encuentra el producto por su ID
            const foundById = results.find((pro) => pro.id === id);

            // Actualiza los campos del producto con los nuevos valores si están presentes en la solicitud
            title ? foundById.title = title : foundById.title;
            clase ? foundById.class = clase : foundById.class;
            price ? foundById.price = price : foundById.price;
            discount ? foundById.discount = discount : foundById.discount;
            history ? foundById.history = history : foundById.history;
            imagePath ? foundById.img = imagePath : foundById.img;

            // Filtra los productos para eliminar el producto original y agrega el producto editado
            // const productos = results.filter(pro => pro.id != foundById.id);
            // productos.push(foundById);

            // Ordena los objetos en base a su ID
            // productos.sort((a, b) => a.id > b.id ? 1 : -1);

            // Escribe los cambios en el archivo JSON
            fs.writeFileSync(path.join(__dirname, '../dataBase/productList.json'), JSON.stringify(dataBase, null, 4));

            res.redirect('/'); // Redirige después de editar el producto
        }
    ],
    // Método para mostrar la página de catálogo de productos
    catalogo: (req, res) => {
        const { results } = dataBase;
        res.render('./product/productCatalogue', { results });
    },
    // Método para mostrar detalles de un producto por su ID
    productDetail: (req, res) => {
        const { id } = req.params;
        const { results } = dataBase;
        const product = results.find(prod => prod.id === id);

        // Renderiza la vista 'product' utilizando el motor de plantillas EJS
        res.render('./product/product', { product });
    },
    // Método para eliminar un producto por su ID
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
