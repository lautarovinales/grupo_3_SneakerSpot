const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const path = require('path');
const dataBaseUsers = require('../dataBase/userList.json');
const multer = require('multer');
const fs = require('fs');
const db = require('../dataBase/models');

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
    res.render('users/register', { errors: [] });
  },

  doRegister: [
    // [
    //     body('name').notEmpty().withMessage('El campo nombre es obligatorio'),
    //     body('lastName').notEmpty().withMessage('El campo apellido es obligatorio'),
    //     body('email').isEmail().withMessage('El campo correo electrónico no es válido'),
    //     body('password').notEmpty().withMessage('El campo contraseña es obligatorio'),
    //     body('img').custom((value, { req }) => {
    //         if (!req.file) {
    //             throw new Error('La imagen es obligatoria');
    //         }
    //         return true;
    //     }),
    // ],
    async (req, res) => {
      const { username, password, email } = req.body;
      // const userImage = req.file ? `/images/users/${req.file.filename}` : '';
      db.User.create({
        username,
        password,
        img: req.file.filename || '',
        email,
        type: 'user'
      })
        .then((result) => {
          res.redirect('/login');
        })
    }
  ],

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
