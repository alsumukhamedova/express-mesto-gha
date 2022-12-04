const Card = require('../models/card');
require('../models/user');
const { DocumentNotFoundError } = require('../errors/DocumentNotFoundError');
const { BadRequest } = require('../errors/BadRequest');
const { Forbidden } = require('../errors/Forbidden');

const {
  STATUS_CREATED,
} = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find().populate('owner').populate('likes')
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(STATUS_CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки. '));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new DocumentNotFoundError('Нет карточки по заданному id.'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new Forbidden('Нельзя удалить чужую карточку.'));
      }
      return card.remove()
        .then(() => res.send({ message: 'Карточка удалена.' }));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new DocumentNotFoundError('Недостаточно данных');
      } else {
        res.send(card);
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new DocumentNotFoundError('Недостаточно данных');
      } else {
        res.send(card);
      }
    })
    .catch(next);
};
