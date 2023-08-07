const path = require('path');
const dataBase = require('../dataBase/productList.json');

const productController = {
    list: (req, res) => {
        res.sendFile(path.resolve(__dirname, '../views/product.ejs'));
    },
    productDetail: (req, res) => {
        const { id } = req.params;
        const { results } = dataBase;

        const product = results.find((prod) => prod.id === id);

        res.render('product', { product });
    }
};

module.exports = productController;