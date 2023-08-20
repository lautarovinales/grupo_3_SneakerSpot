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
    cart:(req, res) =>{
        res.render('./product/productCart', {  data: dataBase.results  });
    },
    creation:(req, res) =>{
        res.render('./product/productCreation');
    },
    createProduct: [
        upload.single('img'),
        (req, res) => {
            try {
                const { title, clase, history, discount, price, stock } = req.body;
                const productImage = req.file;
    
                const imagePath = productImage ? `/images/${productImage.filename}` : '';
    
                // Convertir el ID de cadena a número
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
    edit:(req, res) =>{
        res.render('./product/productEdit');
    },

    showEditById: (req, res) => {
        const id = req.params.id;
        const { results } = dataBase;
        const producto = results.find(pro => pro.id == id);
        // console.log(producto);
        res.render('./product/productEditById', { producto });
    },

    editById: (req, res) => {
        const {id, title, class: clase, price, discount, img, history} = req.body;
        res.send(req.body);
    },
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