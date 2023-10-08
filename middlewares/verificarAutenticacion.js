// middleware/verificarAutenticacion.js

function verificarAutenticacion(req, res, next) {
    // Ajustamos para utilizar la misma clave de sesión
    if (req.session && req.session.userId) {
      console.log("------ USUARIO LOGEADO -------");
      next(); // Usuario autenticado, permite el acceso a la siguiente capa (ruta)
    } else {
      console.log("---- NO SE ----");
        res.redirect('/login');
    }
  }
  
  module.exports = verificarAutenticacion;
  