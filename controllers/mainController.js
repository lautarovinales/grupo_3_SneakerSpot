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
            const errorp = "Error al obtener productos en oferta";
            const errorpDesc = "Hubo un problema al intentar obtener los productos en oferta. Por favor, verificar que la configuración de la base de datos sea la correcta.";
            res.render('error', { errorp, errorpDesc } );
        });
    },
    error: (req, res) => {
        res.render('error');
    }
};

module.exports = mainController;