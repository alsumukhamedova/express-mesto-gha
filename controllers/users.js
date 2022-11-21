const User = require('../models/user');
const DocumentNotFoundError = require('../error');
const {
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL,
} = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ users });
    })
    .catch(() => {
      res.status(STATUS_INTERNAL).send({ message: 'Произошла ошибка.' });
    });
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new DocumentNotFoundError();
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Передан некорректный _id.',
        });
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(STATUS_NOT_FOUND).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else {
        res.status(STATUS_INTERNAL).send({ message: 'Произошла ошибка.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_CREATED).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для обновления.',
        });
      } else {
        res.status(STATUS_INTERNAL).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user === null) {
        throw new DocumentNotFoundError();
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для обновления.',
        });
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(STATUS_NOT_FOUND).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Передан некорректный _id.',
        });
      } else {
        res.status(STATUS_INTERNAL).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user === null) {
        throw new DocumentNotFoundError();
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для обновления.',
        });
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(STATUS_NOT_FOUND).send({
          message: 'Пользователь по указанному _id не найден.',
        });
      } else if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Передан некорректный _id.',
        });
      } else {
        res.status(STATUS_INTERNAL).send({ message: 'Произошла ошибка' });
      }
    });
};
