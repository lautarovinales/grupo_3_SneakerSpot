const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('../dataBase/models');
const { log } = require('console');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/usersImage');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

const authController = {
  profile: (req, res) => {
    const userId = req.session.userId;
    // const usuario = dataBaseUsers.user.find(user => user.id === userId);
    const usuario = db.User.findByPk(userId);

    if (usuario) {
      // Renderizar la vista y pasar la información del usuario
      res.render('users/profile', { usuario });
    } else {
      // Manejar el caso en que el usuario no se encuentre (posiblemente ha manipulado la sesión)
      res.redirect('/login'); // o redirigir a otra página
    }
  },

  login: (req, res) => {
    res.render('users/login');
  },

  register: (req, res) => {
    res.render('users/register');
  },

  doRegister: [
    [
        body('username').notEmpty().withMessage('El campo nombre es obligatorio'),
        body('email').isEmail().withMessage('El campo correo electrónico no es válido'),
        body('password').notEmpty().withMessage('El campo contraseña es obligatorio'),
        body('img').custom((value, { req }) => {
            if (!req.file) {
                throw new Error('La imagen es obligatoria');
            }
            return true;
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Si hay errores de validación, pasa los errores y un mensaje adicional a la vista
            const errorMessage = 'Hay campos sin completar';
            return res.render('users/register', { errors: errors.array(), errorMessage });
        }

        const { username, password, email } = req.body;

        try {
            // Hacer hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Resto del código para crear el usuario en la base de datos
            const result = await db.User.create({
                username,
                password: hashedPassword, // Usamos el hash en lugar de la contraseña original
                img: req.file ? req.file.filename : '',
                email,
                type: 'user'
            });

            console.log('Usuario creado:', result);
            res.redirect('/login');
        } catch (error) {
            // Manejar errores al crear el usuario
            console.error('Error al crear el usuario:', error);
            res.status(500).send('Error interno del servidor');
        }
    }
]


,

  doLogin: (req, res) => {
    const { email, password } = req.body;

    // Buscar el usuario en la base de datos
    // const usuario = dataBaseUsers.user.find(user => user.email === email);
    db.User.findOne({
      where: {
        email: email
      }
    })
    .then((result) => {
      const contra = bcrypt.compare(password, result.password);
      if(contra){
        db.User.findOne({
          where: {
            email: email,
            password: result.password
          }
        })
        .then((result) => {
          req.session.userId = result.id;
          req.session.username = result.username;
          req.session.userImg = result.img;
          req.session.userType = result.type;
          res.redirect('/profile');
        });

      } else {
        res.send('contraseña INCORRECTA');
      }
    })
  }
  ,
  doLogout: (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).send('Error al cerrar sesión');
      }
      res.redirect('/login'); // Puedes redirigir a donde quieras después del cierre de sesión
    });
  }
};

module.exports = authController;
