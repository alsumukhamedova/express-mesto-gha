const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DocumentNotFoundError } = require('../errors/DocumentNotFoundError');
const { BadRequest } = require('../errors/BadRequest');
const { Conflicted } = require('../errors/Conflicted');

const User = require('../models/user');
const { STATUS_CREATED } = require('../utils/constants');

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};
module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new DocumentNotFoundError('Недостаточно данных');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getThisUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new DocumentNotFoundError('Недостаточно данных');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Пользователь по указанному _id не найден.'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then(() => {
      res.status(STATUS_CREATED).send({
        name: req.body.name, about: req.body.about, avatar: req.body.avatar, email: req.body.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании карточки'));
      } else if (err.code === 11000) {
        next(new Conflicted('Пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
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
        throw new DocumentNotFoundError('Недостаточно данных');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
        throw new DocumentNotFoundError('Недостаточно данных');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};
