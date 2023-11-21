const express = require('express');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const methodOverride = require('method-override');
const upload = require('./utils/multerConfig');
const app = express();
const puerto = 3000;
const mainRoute = require('./routes/main');
const productRoute = require('./routes/product');
const authRoute = require('./routes/auth');
const apiRoute = require('./routes/api');
const cors = require('cors');
app.use(cors(
  {
    origin: '*',
    credentials: true,
  }
));

/*para cargar las imagenes en el dashboard de react*/
app.use('/uploads', express.static(path.join(__dirname, './public/images')));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.json());
app.use('/', express.static(__dirname + '/public'));
app.use(session({
  secret: 'secretojeje',
  resave: false,
  saveUninitialized: false,
}));
app.use((req, res, next) => {
  res.locals.userId = req.session.userId || null;
  next();
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', mainRoute);
app.use('/product', productRoute);
app.use('/', authRoute);
app.use('/api', apiRoute);

app.listen(puerto, () => {
  console.log(`Aplicación escuchando en puerto ${puerto}`);
});
