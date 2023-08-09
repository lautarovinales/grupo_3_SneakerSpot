const path = require('path');

const authController = {
    login: (req, res) => {
        // Lógica para mostrar la página de inicio de sesión
        res.render('users/login');
    },

    register: (req, res) => {
        // Lógica para mostrar la página de registro
        res.render('users/register');
    },

    doRegister: (req, res) => {
        // Lógica para procesar el registro del usuario
        // ...
    },

    doLogin: (req, res) => {
        // Lógica para procesar el inicio de sesión del usuario
        // ...
    },

    // Otras acciones relacionadas con la autenticación
};

module.exports = authController;
