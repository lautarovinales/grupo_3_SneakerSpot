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
    // Método para mostrar detalles de un producto
    productDetail: (req, res) => {
        // Obtiene el parámetro 'id' de la solicitud (URL)
        const { id } = req.params;

        // Desestructura el objeto dataBase, obteniendo la propiedad 'results'
        const { results } = dataBase;

        // Busca el producto con el ID especificado en los resultados
        const product = results.find((prod) => prod.id === id);

        // Renderiza la vista 'product' utilizando el motor de plantillas EJS
        // Se pasa el objeto 'product' como dato, para que esté disponible en la vista
        res.render('./product/product', { product });
    }
};

// Exporta el controlador de productos para que pueda ser utilizado en otros archivos
module.exports = productController;