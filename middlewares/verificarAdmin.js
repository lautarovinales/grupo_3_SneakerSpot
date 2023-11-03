function verificarAdmin(req, res, next) {
    const user = req.session.user;
    console.log('Usuario en req.session.user:', user);
    if (user && user.type === 'admin') {
      next();
    } else {
      res.status(403).send('Acceso no autorizado');
    }
  }
  
  module.exports = verificarAdmin;