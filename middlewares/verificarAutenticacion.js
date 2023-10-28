function verificarAutenticacion(req, res, next) {
    if (req.session && req.session.userId) {
      console.log("------ USUARIO LOGEADO -------");
      next();
    } else {
      console.log("---- NO SE ----");
        res.redirect('/login');
    }
  }
  
  module.exports = verificarAutenticacion;
  