const jwt = require('jsonwebtoken');
const authError = require('../error');


module.exports = (req, res, next) => {
  const { auth } = req.headers;
  if (!auth || !auth.startsWith('Bearer')) {
    throw new authError('Необходима авторизация');
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
