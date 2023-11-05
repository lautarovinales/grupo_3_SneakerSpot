function verificarAutenticacion(req, res, next) {
    if (req.session && req.session.userId) {
      console.log("------ USUARIO LOGEADO -------");
      res.locals.userType = req.session.userType
      next();
    } else {
      console.log("---- NO SE ----");
        res.redirect('/login');
    }
  }
  
  module.exports = verificarAutenticacion;
  