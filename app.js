// Importa los módulos necesarios
const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer'); // Importa Multer para manejar la carga de imágenes
const methodOverride = require('method-override'); // Importa method-override para habilitar métodos HTTP PUT y DELETE

// Crea una instancia de la aplicación Express
const app = express();

// Configuración del puerto en el que se ejecutará el servidor: 3000
const puerto = 3000;

// Importa las rutas
const mainRoute = require('./routes/main');
const productRoute = require('./routes/product');
const authRoute = require('./routes/auth');

// Configuración del middleware
app.use(express.urlencoded({ extended: false })); // Analiza datos de formularios
app.use(methodOverride('_method')); // Habilita el uso de _method para métodos PUT y DELETE
app.use(express.json()); // Analiza datos JSON en las solicitudes
app.use('/', express.static(__dirname + '/public')); // Sirve archivos estáticos desde 'public'
app.use(session({
    secret: 'tu_secreto_super_secreto',
    resave: false,
    saveUninitialized: false,
  }));
  app.use((req, res, next) => {
    res.locals.userId = req.session.userId || null;
    next();
  });
app.set('view engine', 'ejs'); // Establece el motor de plantillas como EJS
app.set('views', path.join(__dirname, 'views')); // Establece el directorio de vistas

// Configuración de Multer para manejar la carga de imágenes
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images'); // Ruta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único del archivo
    }
});
const upload = multer({ storage: storage });

// Configuración de las rutas
app.use('/', mainRoute); // Ruta raíz
app.use('/product', productRoute); // Rutas relacionadas con productos
app.use('/', authRoute); // Rutas relacionadas con autenticación

// Inicia el servidor y escucha en el puerto especificado
app.listen(puerto, () => {
    console.log(`Aplicación escuchando en puerto ${puerto}`);
});
