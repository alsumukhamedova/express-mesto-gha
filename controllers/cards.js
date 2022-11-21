const Card = require('../models/card');
require('../models/user');
const DocumentNotFoundError = require('../error');
const {
  STATUS_CREATED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_INTERNAL,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find().populate('owner').populate('likes')
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => res.status(STATUS_INTERNAL).send({
      message: 'Произошла ошибка',
    }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки. ',
        });
      } else {
        res.status(STATUS_INTERNAL).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card == null) {
        throw new DocumentNotFoundError();
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные удаления.',
        });
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(STATUS_NOT_FOUND).send({
          message: 'Карточка с указанным _id не найдена.',
        });
      } else {
        res.status(STATUS_INTERNAL).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new DocumentNotFoundError();
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка.',
        });
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(STATUS_NOT_FOUND).send({
          message: 'Передан несуществующий id.',
        });
      } else {
        res.status(STATUS_INTERNAL).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new DocumentNotFoundError();
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для снятия лайка.',
        });
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(STATUS_NOT_FOUND).send({
          message: 'Передан несуществующий _id карточки.',
        });
      } else {
        res.status(STATUS_INTERNAL).send({ message: 'Произошла ошибка' });
      }
    });
};
