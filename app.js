// Importa el módulo 'express'
const express = require('express');
// Importa el módulo 'path' para trabajar con rutas de archivos y directorios
const path = require('path');
// Crea una instancia de la aplicación Express
const app = express();
// Configura el puerto en el que se ejecutará el servidor: 3000
const puerto = 3000;
// Importa el archivo de rutas principal ('main.js') desde el directorio './src/routes/'
const mainRoute = require('./routes/main');
// Importa el archivo de rutas de productos ('product.js') desde el directorio './src/routes/'
const productRoute = require('./routes/product');
// Importa el archivo de rutas de usuarios ('product.js') desde el directorio './src/routes/'
const authRoute = require('./routes/auth');

const methodOverride = require('method-override');

// Configura el middleware para analizar datos JSON en las solicitudes entrantes
app.use(express.json());
// Configura el middleware para servir archivos estáticos desde el directorio 'public'
app.use('/', express.static(__dirname + '/public'));
// Establece el motor de plantillas como 'ejs' para renderizar vistas
app.set('view engine', 'ejs');
// Establece el directorio donde se encuentran las vistas del motor de plantillas
app.set('views', path.join(__dirname, 'views'));
// Configura el middleware de manejo de rutas para la ruta raíz '/'
app.use('/', mainRoute);
// Configura el middleware de manejo de rutas para la ruta '/product'
app.use('/product', productRoute);
// Configura el middleware de manejo de rutas para la ruta '/product'
app.use('/', authRoute);

app.use(methodOverride('_method'));

// Inicia el servidor y escucha en el puerto especificado
app.listen(puerto, () => {
    console.log('Aplicación escuchando en puerto 3000');
});