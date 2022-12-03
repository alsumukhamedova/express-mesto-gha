const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUser, updateAvatar, getThisUserInfo, updateUser,
} = require('../controllers/users');

router.get('/me', getThisUserInfo);

router.get('', getUsers);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24),
  }),
}), getUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/(http(s)?:\/\/)?(www\.)?[A-Za-zА-Яа-я0-9-]*\.[A-Za-zА-Яа-я0-9-]{2,8}(\/?[\wа-яА-Я#!:.?+=&%@!_~[\]$'*+,;=()-]*)*/),
  }),
}), updateAvatar);

router.patch('/me/avatar', updateUser);

module.exports = router;
