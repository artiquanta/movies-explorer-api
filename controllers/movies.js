const Movie = require('../models/movie');
const WrongDataError = require('../errors/wrong-data-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const {
  wrongMovieData,
  noMovieById,
  notMovieOwner,
  movieRemovingSuccess,
} = require('../utils/constants');

// Запрос всех фильмов пользователя
module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }).sort('-CreatedAt')
    .then(movies => res.send({ movies }))
    .catch(err => next(err));
};

// Сохранение фильма
module.exports.saveMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRu,
    nameEn,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink: trailer,
    thumbnail,
    movieId,
    nameRu,
    nameEn,
    owner: req.user._id,
  })
    .then(movie => res.send({
      country: movie.country,
      director: movie.director,
      duration: movie.duration,
      year: movie.year,
      description: movie.description,
      image: movie.image,
      trailer: movie.trailerLink,
      thumbnail: movie.thumbnail,
      movieId: movie.movieId,
      nameRu: movie.nameRu,
      nameEn: movie.nameEn,
      _id: movie._id,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return next(new WrongDataError(wrongMovieData));
      }
      return next(err);
    });
};

// Удаление фильма из сохранённых
module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  Movie.findById(id)
    .orFail(() => next(new NotFoundError(noMovieById)))
    .then(movie => {
      if (movie.owner.toString() !== req.user._id) {
        return next(new ForbiddenError(notMovieOwner));
      }
      return Movie.findByIdAndRemove(id)
        .then(() => {
          res.send({
            message: movieRemovingSuccess,
          });
        })
        .catch(err => next(err));
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return next(new WrongDataError(noMovieById));
      }
      return next(err);
    });
};
