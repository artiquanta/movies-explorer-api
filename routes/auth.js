const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, login, logout } = require('../controllers/users');
const { celebrateErrors } = require('../utils/utils');

// Конфиг rate limit для ограничения количества запросов на авторизацию и регистрацию
const { rateLimitConfigAuth } = require('../utils/security');

// Регистрация пользователя
router.post('/signup', rateLimitConfigAuth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }).messages(celebrateErrors),
}), createUser);

// Авторизация пользователя
router.post('/signin', rateLimitConfigAuth, celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }).messages(celebrateErrors),
}), login);

// Выход из системы
router.get('/logout', rateLimitConfigAuth, logout);

module.exports = router;
