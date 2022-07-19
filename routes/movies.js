const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMovies, saveMovie, deleteMovie } = require('../controllers/movies');
const { celebrateErrors, urlPattern } = require('../utils/utils');

// Запрос всех фильмов пользователя
router.get('/', getMovies);

// Сохранение фильма
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlPattern),
    trailer: Joi.string().required().pattern(urlPattern),
    thumbnail: Joi.string().required().pattern(urlPattern),
    movieId: Joi.string().required(),
    nameRu: Joi.string().required(),
    nameEn: Joi.string().required(),
  }).messages(celebrateErrors),
}), saveMovie);

// Удаление фильма
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }).messages(celebrateErrors),
}), deleteMovie);

module.exports = router;
