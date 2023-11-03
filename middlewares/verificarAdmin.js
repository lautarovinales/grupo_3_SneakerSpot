function verificarAdmin(req, res, next) {
  const userType = req.session.userType;
  console.log('Tipo de usuario en req.session.userType:', userType);

  if (userType && userType === 'admin') {
    next();
  } else {
    res.status(403).send('Acceso no autorizado');
  }
}

module.exports = verificarAdmin;