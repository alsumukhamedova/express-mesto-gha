const Card = require('../models/card');
require('../models/user');
const { DocumentNotFoundError, BadRequest, Forbidden} = require('../error');

const {
  STATUS_CREATED
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
  console.log(req.user._id);
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        res.send({ card });
      } else {
        throw new Forbidden('Невозможно удалить карточку');
      }
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
        throw new DocumentNotFoundError();
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
        throw new DocumentNotFoundError();
      } else {
        res.send(card);
      }
    })
    .catch(next);
};
