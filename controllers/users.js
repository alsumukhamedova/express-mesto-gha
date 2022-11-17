
const User = require('../models/user.js');
const DocumentNotFoundError = require("../error");
const {
  status_created,
  status_bad_request,
  status_not_found,
  status_internal,
} = require('../utils/constants');
module.exports.getUsers = (req, res) => {
  User.find()
    .orFail(() => {
      throw new DocumentNotFoundError;
    })
    .then((users) => {
      res.send({users})
    })
}
module.exports.getUser = (req, res) => {
    User.findById(req.params.userId)
        .orFail(() => {
            throw new DocumentNotFoundError;
        })
        .then((user) => {
                res.send({user})
        })
        .catch((err) => {
            if (err.name === "ReferenceError") {
                res.status(status_not_found).send({
                    "message": "Пользователь по указанному _id не найден."
                })
            } else if (err.name === "CastError") {
                res.status(status_bad_request).send({
                    "message": "Передан некорректный _id."
                })
            } else {
                res.status(status_internal).send({message: 'Произошла ошибка'})
            }
        });
}

module.exports.createUser = (req, res) => {
    const {name, about, avatar} = req.body;
    User.create({name, about, avatar})
        .then(user => res.status(status_created).send({user}))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(status_bad_request).send({
                    "message": "Передан некорректный _id."
                })
            } else {
                res.status(status_internal).send({message: 'Произошла ошибка'})
            }
        });
}

module.exports.updateUser = (req, res) => {
    const {name, about} = req.body;
    User.findByIdAndUpdate(req.user._id,
        {name, about},
        {
            new: true,
            runValidators: true,
            upsert: false
        })
        .then(user => res.send({user}))
        .catch((err) => {
            if (err.name === 'ValidationError') {
                res.status(status_bad_request).send({
                    "message": "Передан некорректный _id."
                })
            }
            if (err.statusCode === status_not_found) {
                res.status(status_not_found).send({
                    "message": "Пользователь по указанному _id не найден."
                })
            } else {
                res.status(status_internal).send({message: 'Произошла ошибка'})
            }
        })
}

module.exports.updateAvatar = (req, res) => {
    const {avatar} = req.body;
    User.findByIdAndUpdate(req.user._id,
        {avatar: avatar},
        {
            new: true,
            runValidators: true,
            upsert: false
        })
        .then(user => res.send({user}))
        .catch((err) => {
                if (err.name === 'ValidationError') {
                    res.status(status_bad_request).send({
                        "message": "Передан некорректный _id."
                    })
                }
                if (req.params.userId === req.user._id) {
                    res.status(status_not_found).send({
                        "message": "Пользователь по указанному _id не найден."
                    })
                } else {
                    res.status(status_internal).send({message: 'Произошла ошибка'})
                }
            }
        );
}