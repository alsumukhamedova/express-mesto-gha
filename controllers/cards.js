const Card = require('../models/card.js');
require('../models/user.js');
const DocumentNotFoundError = require('../error.js');
const {
  status_created,
  status_bad_request,
  status_not_found,
  status_internal,
} = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find().populate('owner').populate('likes')
    .then(cards => {
      res.send({data: cards})
    })
    .catch(() => res.status(status_internal).send({
      "message": 'Произошла ошибка'
    }))
};

module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then(card => res.status(status_created).send({data: card}))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(status_bad_request).send({
          "message": "Переданы некорректные данные при создании карточки. "
        })
      } else {
        res.status(status_internal).send({message: 'Произошла ошибка'})
      }
    });
}

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(card => res.send({data: card}))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(status_bad_request).send({
          "message": "Переданы некорректные данные удаления."
        })
      } else if (err.name === "ResourceNotFoundError") {
        res.status(status_not_found).send({
          "message": "Карточка с указанным _id не найдена."
        })
      } else {
        res.status(status_internal).send({message: 'Произошла ошибка'})
      }
    });
}

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true},)
    .then((card) => {
      if (card === null) {
        throw new DocumentNotFoundError();
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(status_bad_request).send({
          "message": "Переданы некорректные данные для постановки лайка."
        })
      } else if (err.name === 'ResourceNotFoundError') {
        res.status(status_not_found).send({
          "message": "Передан несуществующий id."
        })
      } else {
        res.status(status_internal).send({message: 'Произошла ошибка'})
      }
    });
}

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true},)
    .then(card => res.send({data: card}))
    .catch((err) => {
        if (err.name === 'CastError') {
          res.status(status_bad_request).send({
            "message": "Переданы некорректные данные для снятия лайка."
          })
        } else if (err.name === "ResourceNotFoundError") {
          res.status(status_not_found).send({
            "message": "Передан несуществующий _id карточки."
          })
        } else {
          res.status(status_internal).send({message: 'Произошла ошибка'})
        }
      }
    )
  ;
}