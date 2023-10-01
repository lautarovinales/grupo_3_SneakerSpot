// Importación de módulos necesarios
const path = require('path');
const dataBase = require('../dataBase/productList.json');
const productController = require('./productController')

// Definición del controlador principal
const mainController = {
    // Método para manejar la página principal (home)
    home: (req, res) => {
        // Desestructura el objeto dataBase, obteniendo la propiedad 'results'
        const { results } = dataBase;
        const productosEnOferta = results.filter(producto => producto.enOferta);
    
        // Renderiza la vista index.ejs utilizando el motor de plantillas EJS
        // Pasa el array 'productosEnOferta' como datos para la vista
        res.render('index', { productosEnOferta });
    }
    
};

// Exporta el controlador principal para que pueda ser utilizado en otros archivos
module.exports = mainController;
