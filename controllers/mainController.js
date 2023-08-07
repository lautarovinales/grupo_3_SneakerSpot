const path = require('path');
const dataBase = require('../dataBase/productList.json');

const mainController = {
    home: (req, res) =>{
        const { results } = dataBase;
        res.sendFile(path.resolve(__dirname, '../views/index.ejs')), res.render('index', {data: results})
    }
  }

module.exports = mainController;