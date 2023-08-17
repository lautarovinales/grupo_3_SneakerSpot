// Importación de módulos necesarios
const path = require('path'); // Módulo para manejar rutas de archivos y directorios
const dataBase = require('../dataBase/productList.json'); // Importa los datos desde productList.json

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
    edit:(req, res) =>{
        res.render('./product/productEdit');
    },

    showEditById: (req, res) => {
        const id = req.params.id;
        const { results } = dataBase;
        const producto = results.find(pro => pro.id == id);
        console.log(producto);
        res.render('./product/productEditById', { producto });
    },

    editById: (req, res) => {

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