const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('../dataBase/models');
const upload = require('../utils/multerConfig');

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
  editProfile: async (req, res) => {
    const userId = req.session.userId;

    try {
      const usuario = await db.User.findByPk(userId);

      if (usuario) {
        console.log('Usuario encontrado:', usuario); // Agrega esta línea
        res.render('users/editProfile', { usuario });
      } else {
        console.log('Usuario no encontrado'); // Agrega esta línea
        res.redirect('/login');
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).send('Error interno del servidor');
    }
  },
  doEditProfile: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessage = 'Hay campos sin completar';
      return res.render('users/editProfile', { errors: errors.array(), errorMessage });
    }

    const { username, password, email } = req.body;
    const userId = req.session.userId;

    try {
      const usuario = await db.User.findByPk(userId);

      if (usuario) {
        console.log('Usuario antes de la modificación:', usuario);

        // Actualizar la información del usuario
        usuario.username = username;
        usuario.email = email;

        if (password) {
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          usuario.password = hashedPassword;
        }

        // Eliminar la imagen anterior si existe
        if (req.file && usuario.img) {
          const imagePath = path.join(__dirname, '../public/usersImage', usuario.img);

          // Verificar que el archivo exista antes de intentar eliminarlo
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log('Imagen anterior eliminada:', usuario.img);
          }
        }

        // Actualizar la imagen de perfil si se carga un nuevo archivo
        if (req.file) {
          usuario.img = req.file.filename;
        }

        console.log('Usuario después de la modificación:', usuario);

        await usuario.save();

        console.log('Perfil actualizado para el usuario:', usuario.id);
        res.redirect('/profile');
      } else {
        res.redirect('/login');
      }
    } catch (error) {
      console.error('Error al editar el perfil:', error);
      res.status(500).send('Error interno del servidor');
    }
  },
  doRegister: [
    [
        body('username')
            .notEmpty().withMessage('El campo nombre es obligatorio')
            .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

        body('email')
            .notEmpty().withMessage('El campo correo electrónico es obligatorio')
            .isEmail().withMessage('El formato de correo electrónico no es válido')
            .custom(async (value) => {
                const existingUser = await db.User.findOne({ where: { email: value } });
                if (existingUser) {
                    throw new Error('Este correo electrónico ya está registrado');
                }
                return true;
            }),

        body('password')
            .notEmpty().withMessage('El campo contraseña es obligatorio')
            .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),

        body('img')
            .custom((value, { req }) => {
                if (!req.file) {
                    throw new Error('La imagen es obligatoria');
                }

                const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
                const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

                if (!allowedExtensions.includes(fileExtension)) {
                    throw new Error('El archivo de imagen debe ser JPG, JPEG, PNG, o GIF');
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
  doLogin: [
    [
        body('emailOrUsername')
            .notEmpty().withMessage('El campo correo electrónico es obligatorio'),
            // .isEmail().withMessage('El formato de correo electrónico no es válido'),

        body('password')
            .notEmpty().withMessage('El campo contraseña es obligatorio')
            .custom(async (value, { req }) => {
                const { emailOrUsername } = req.body;
                let user = await db.User.findOne({ where: { email: emailOrUsername } });

                if (!user) {
                    user = await db.User.findOne({ where: { username: emailOrUsername } });
                    if(!user) {
                      throw new Error('Correo electrónico o nombre de usuario no encontrado');
                    }
                }

                const passwordMatch = await bcrypt.compare(value, user.password);

                if (!passwordMatch) {
                    throw new Error('Contraseña incorrecta');
                }

                return true;
            }),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // Si hay errores de validación, pasa los errores y un mensaje adicional a la vista
            const errorMessage = 'Correo electrónico o contraseña incorrectos';
            return res.render('users/login', { errors: errors.array(), errorMessage });
        }

        // Obtener el usuario de la base de datos por el correo electrónico
        const { emailOrUsername, password } = req.body;
        try {
          let user;
            if(emailOrUsername.includes('@')) {
              user = await db.User.findOne({ where: { email: emailOrUsername } });
            }
            else {
              user = await db.User.findOne({ where: { username: emailOrUsername } });
            }

            // Contraseña correcta, establecer información del usuario en la sesión
            req.session.userId = user.id;
            req.session.username = user.username;
            req.session.userImg = user.img;
            req.session.userType = user.type;

            // Mostrar el correo electrónico del usuario en la consola
            console.log('Login exitoso para el correo electrónico:', user.email);

            // Redirigir al usuario a la página de inicio (ajusta la ruta según tu configuración)
            return res.redirect('/profile'); // Cambia '/inicio' por la ruta deseada
        } catch (error) {
            console.error('Error en el servidor:', error);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
    }
  ],
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
