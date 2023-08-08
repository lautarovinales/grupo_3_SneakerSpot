// Importación de módulos necesarios
const path = require('path'); // Módulo para manejar rutas de archivos y directorios
const dataBase = require('../dataBase/productList.json'); // Importa los datos desde productList.json

// Definición del controlador principal
const mainController = {
    // Método para manejar la página principal (home)
    home: (req, res) => {
        // Desestructura el objeto dataBase, obteniendo la propiedad 'results'
        const { results } = dataBase;
        
        // Envía el archivo index.ejs al cliente como respuesta
        res.sendFile(path.resolve(__dirname, '../views/index.ejs'));

        // Renderiza la vista index.ejs utilizando el motor de plantillas EJS
        // Se pasa el objeto 'results' como dato, para que esté disponible en la vista
        res.render('index', { data: results });
    }
};

// Exporta el controlador principal para que pueda ser utilizado en otros archivos
module.exports = mainController;