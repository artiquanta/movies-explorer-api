const { sign } = require('jsonwebtoken');
const { hash } = require('bcryptjs');
const User = require('../models/user');
const { secretKey } = require('../utils/utils');
const {
  wrongUserCreationData,
  alreadyRegisteredEmail,
  authSuccess,
  wrongPasswordOrEmail,
  logoutMessage,
  noUserById,
  incorrectUserId,
  wrongUserUpdateData,
} = require('../utils/constants');
const WrongDataError = require('../errors/wrong-data-err');
const AlreadyExistError = require('../errors/already-exist-err');
const NotAuthorizedError = require('../errors/not-authorized-err');
const NotFoundError = require('../errors/not-found-err');

const { NODE_ENV, JWT_SECRET } = process.env;

// Регистрация пользователя
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  hash(password, 10)
    .then(passwordHash => User.create({
      name,
      email,
      password: passwordHash,
    }))
    .then(user => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'ValidationError') {
        return next(new WrongDataError(wrongUserCreationData));
      }
      if (err.code === 11000) {
        return next(new AlreadyExistError(alreadyRegisteredEmail));
      }
      return next(err);
    });
};

// Авторизация пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(user => {
      const token = sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : secretKey,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          domain: '.movielibrary.nomoredomains.xyz',
          maxAge: 604800000,
          httpOnly: true,
          sameSite: true,
        })
        .cookie('auth', 'active', {
          domain: '.movielibrary.nomoredomains.xyz',
          maxAge: 604800000,
          sameSite: true,
        })
        .send({ message: authSuccess });
    })
    .catch(() => {
      next(new NotAuthorizedError(wrongPasswordOrEmail));
    });
};

// Выход из системы
module.exports.logout = (req, res) => {
  res
    .clearCookie('jwt', {
      domain: 'localhost',
      httpOnly: true,
      sameSite: true,
    })
    .clearCookie('auth', {
      domain: 'localhost',
      sameSite: true,
    })
    .send({ message: logoutMessage });
};

// Запрос информации о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError(noUserById)))
    .then(user => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch(err => {
      if (err.name === 'CastError') {
        return next(new WrongDataError(incorrectUserId));
      }
      return next(err);
    });
};

// Обновление профиля пользователя
module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(() => next(new NotFoundError(noUserById)))
    .then(user => {
      res.send({
        name: user.name,
        email: user.email,
        _id: user._id,
      });
    })
    .catch(err => {
      if (err.name === 'ValidationError') {
        return next(new WrongDataError(wrongUserUpdateData));
      }
      return next(err);
    });
};
