const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
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
    profile: async (req, res) => {
      const userId = req.session.userId;
  
      try {
        // Obtener el usuario de la base de datos por el ID almacenado en la sesión
        const usuario = await db.User.findByPk(userId);
  
        if (usuario) {
          // Renderizar la vista y pasar la información del usuario
          res.render('users/profile', { usuario });
        } else {
          // Manejar el caso en que el usuario no se encuentre (posiblemente ha manipulado la sesión)
          res.redirect('/login'); // o redirigir a otra página
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).send('Error interno del servidor');
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
],
doLogin: async (req, res) => {
  // Validación de campos
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Obtener el usuario de la base de datos por el correo electrónico
  const { email, password } = req.body;
  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user || user.type !== 'user') {
      console.log('Usuario no encontrado o tipo de usuario incorrecto para el correo electrónico:', email);
      return res.status(401).json({ error: 'Correo electrónico no encontrado o tipo de usuario incorrecto' });
    }

    // Comparar contraseñas hasheadas
    const passwordMatch = await bcrypt.compare(password, user.password);

    console.log('Contraseña ingresada:', password);
    console.log('Contraseña almacenada en la base de datos:', user.password);

    if (passwordMatch) {
      // Contraseña correcta, establecer información del usuario en la sesión
      req.session.userId = user.id;
      req.session.username = user.username;
      req.session.userImg = user.img;
      req.session.userType = user.type;

      // Mostrar el correo electrónico del usuario en la consola
      console.log('Login exitoso para el correo electrónico:', user.email);
      
      // Redirigir al usuario a la página de inicio (ajusta la ruta según tu configuración)
      return res.redirect('/profile'); // Cambia '/inicio' por la ruta deseada
    } else {
      // Contraseña incorrecta
      console.log('Contraseña incorrecta para el correo electrónico:', email);
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.error('Error en el servidor:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
},
doLogout: (req, res) => {
  // Eliminar la información del usuario de la sesión
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }

    // Mostrar mensaje en la consola al cerrar sesión
    console.log('Sesión cerrada exitosamente.');

    // Redirigir al usuario a la página de inicio de sesión (ajusta la ruta según tu configuración)
    return res.redirect('/login'); // Cambia '/inicio' por la ruta deseada
  });
}
};

module.exports = authController;
