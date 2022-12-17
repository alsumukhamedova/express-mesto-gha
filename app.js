const express = require('express');
const mongoose = require('mongoose');
const { errors, Joi, celebrate } = require('celebrate');
const users = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { authorization } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const { DocumentNotFoundError } = require('./errors/DocumentNotFoundError');

const {
  STATUS_INTERNAL,
} = require('./utils/constants');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://0.0.0.0:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6354232509ef3153343b6f84',
  };
  next();
});
app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/(http(s)?:\/\/)?(www\.)?[A-Za-zА-Яа-я0-9-]*\.[A-Za-zА-Яа-я0-9-]{2,8}(\/?[\wа-яА-Я#!:.?+=&%@!_~[\]$'*+,;=()-]*)*/),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(authorization);
app.use('/users', users);
app.use('/cards', cardRouter);
app.use('*', (req, res, next) => {
  next(new DocumentNotFoundError('Страница не найдена'));
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(STATUS_INTERNAL).send({ message: 'Произошла ошибка' });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
