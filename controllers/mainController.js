// Importación de módulos necesarios
const path = require('path');
const productController = require('./productController')
const db = require('../dataBase/models');

// Definición del controlador principal
const mainController = {
    home: (req, res) => {
        db.Product.findAll({
            where: {
                enOferta: true
            }
        })
        .then((results) => {
            res.render('index', { productosEnOferta: results });
        })
        .catch((error) => {
            console.error('Error al obtener productos en oferta:', error);
            res.render('error');
        });
    },
    error: (req, res) => {
        res.render('error');
    }
};

module.exports = mainController;