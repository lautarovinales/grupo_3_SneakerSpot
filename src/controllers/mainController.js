const path = require('path');
const dataBase = require('../dataBase/productList.json');
const productController = require('./productController')

const mainController = {
    home: (req, res) => {
        const { results } = dataBase;
        const productosEnOferta = results.filter(producto => producto.enOferta);
    
        res.render('index', { productosEnOferta });
    }
    
};

module.exports = mainController;