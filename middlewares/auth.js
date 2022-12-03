const jwt = require('jsonwebtoken');
const { AUTH_ERROR } = require('../utils/constants');
const { AuthError } = require('../errors/AuthError');

module.exports.authorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new AuthError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(AUTH_ERROR);
  }
  req.user = payload;
  next();
};
