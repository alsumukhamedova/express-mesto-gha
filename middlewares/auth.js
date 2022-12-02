const jwt = require('jsonwebtoken');
const AuthError = require('../error');

module.exports = (req, res, next) => {
  const { auth } = req.headers;
  if (!auth || !auth.startsWith('Bearer')) {
    throw new AuthError('Необходима авторизация');
  }
  const token = auth.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(err);
  }
  req.user = payload;
  next();
};
