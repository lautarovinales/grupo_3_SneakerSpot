const path = require('path');
const dataBaseUsers = require('../dataBase/userList.json');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/usersImage'); // Ruta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Nombre único del archivo
    }
});

const upload = multer({ storage: storage });

const authController = {
    login: (req, res) => {
        // Lógica para mostrar la página de inicio de sesión
        res.render('users/login');
    },

    register: (req, res) => {
        // Lógica para mostrar la página de registro
        res.render('users/register');
    },

    doRegister: [
        upload.single('img'), // Middleware para cargar una imagen
        async (req, res) => {
            const {type, name, lastName, email, password} = req.body;
            const userImage = req.file;

            // Construye la ruta de la imagen si se ha cargado
            const imagePath = userImage ? `/usersImage/${userImage.filename}` : '';

            // Genera un nuevo ID para el producto
            const newUserId = dataBaseUsers.user.length > 0 ? parseInt(dataBaseUsers.user[dataBaseUsers.user.length - 1].id) + 1 : 1;

            // Crea un nuevo objeto de producto
            const newUser = {
                id: newUserId.toString(),
                type: 'user',
                name,
                lastName,
                email,
                password,
                img: imagePath,
            };

            // Agrega el nuevo producto a la base de datos
            dataBaseUsers.user.push(newUser);

            // Escribe los cambios en el archivo JSON
            fs.writeFileSync(path.join(__dirname, '../dataBase/userList.json'), JSON.stringify(dataBaseUsers, null, 4));

            res.redirect('/login'); // Redirige después de crear el producto
    }
    ],

    doLogin: (req, res) => {
        // Lógica para procesar el inicio de sesión del usuario
        // ...
    },

    // Otras acciones relacionadas con la autenticación
};

module.exports = authController;
