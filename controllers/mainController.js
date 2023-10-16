// Importación de módulos necesarios
const path = require('path');
// const dataBase = require('../dataBase/productList.json');
const productController = require('./productController')
const db = require('../dataBase/models');

// Definición del controlador principal
const mainController = {
    // Método para manejar la página principal (home)
    home: (req, res) => {
        db.Product.findAll((
            {
                where: {
                    enOferta: true
                }
            }
        ))
            .then((results) => {
                res.render('index', {productosEnOferta: results})
            })

        // const { results } = dataBase;
        // const productosEnOferta = results.filter(producto => producto.enOferta);
        // res.render('index', { productosEnOferta });
    }
};


module.exports = mainController;