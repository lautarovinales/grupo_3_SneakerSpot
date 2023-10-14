// Importación de módulos necesarios
const path = require('path');
// const dataBase = require('../dataBase/productList.json');
const productController = require('./productController')
const db = require('../dataBase/models');

// Definición del controlador principal
const mainController = {
    // Método para manejar la página principal (home)
    home: (req, res) => {
        // const { results } = dataBase;
        // const productosEnOferta = results.filter(producto => producto.enOferta);
        // res.render('index', { productosEnOferta });

        db.Product.findAll((
            {
                where: {
                    enOferta: true
                }
            }
        ))
            .then((results) => {
                // console.log(results);
                // res.send(results);
                res.render('index', {productosEnOferta: results})
            })
    }
    
};


module.exports = mainController;