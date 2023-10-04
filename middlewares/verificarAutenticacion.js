// middleware/verificarAutenticacion.js

function verificarAutenticacion(req, res, next) {
    // Ajustamos para utilizar la misma clave de sesión
    if (req.session && req.session.userId) {
      next(); // Usuario autenticado, permite el acceso a la siguiente capa (ruta)
    } else {
        res.redirect('/login');
    }
  }
  
  module.exports = verificarAutenticacion;
  