const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCurrentUser, updateUser } = require('../controllers/users');
const { celebrateErrors } = require('../utils/utils');

// Запрос информации о текущем пользователе
router.get('/me', getCurrentUser);

// Обновление информации о пользователе
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: { allow: false } }),
  }).messages(celebrateErrors),
}), updateUser);

module.exports = router;
