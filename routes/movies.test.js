/* eslint-env jest */
const mongoose = require('mongoose');
const supertest = require('supertest');
const { sign } = require('jsonwebtoken');

const app = require('../app');

const request = supertest(app);

const { movieData } = require('../fixtures/index');
const User = require('../models/user');
const { movieRemovingSuccess, noMovieById, notMovieOwner } = require('../utils/constants');
const { secretKey } = require('../utils/utils');

beforeAll(() => mongoose.connect('mongodb://localhost:27017/moviesdb'));

afterAll(() => mongoose.disconnect());

describe('Проверка сохранения, запроса и удаления фильма', () => {
  let userId;
  let token;
  let strangerUserId;
  let strangerToken;
  let filmId;

  beforeAll(() => {
    // Создание двух пользователей
    return User.create({
      email: movieData.email,
      password: movieData.password,
      name: movieData.name,
    }, {
      email: movieData.testEmail,
      password: movieData.password,
      name: movieData.name,
    })
      .then(response => {
        userId = response[0]._id.toString();
        strangerUserId = response[1]._id.toString();
        token = sign(
          { _id: userId },
          secretKey,
          { expiresIn: '1d' },
        );
        strangerToken = sign(
          { _id: strangerUserId },
          secretKey,
          { expiresIn: '1d' },
        );
      });
  });

  afterAll(() => {
    return User.deleteMany({ _id: [userId, strangerUserId] });
  });

  it('Должен сохранить фильм', () => {
    return request.post('/movies')
      .set('Cookie', [`jwt=${token}`])
      .send({
        country: movieData.country,
        director: movieData.director,
        duration: movieData.duration,
        year: movieData.year,
        description: movieData.description,
        image: movieData.image,
        trailer: movieData.trailer,
        thumbnail: movieData.thumbnail,
        movieId: movieData.movieId,
        nameRu: movieData.nameRu,
        nameEn: movieData.nameEn,
      })
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.country).toBe(movieData.country);
        expect(response.body.director).toBe(movieData.director);
        expect(response.body.duration).toBe(movieData.duration);
        expect(response.body.year).toBe(movieData.year);
        expect(response.body.description).toBe(movieData.description);
        expect(response.body.image).toBe(movieData.image);
        expect(response.body.trailer).toBe(movieData.trailer);
        expect(response.body.thumbnail).toBe(movieData.thumbnail);
        expect(response.body.movieId).toBe(movieData.movieId);
        expect(response.body.nameRu).toBe(movieData.nameRu);
        expect(response.body.nameEn).toBe(movieData.nameEn);
        expect(response.body._id).toBeDefined();
        filmId = response.body._id;
      });
  });

  it('Должен вернуть фильмы пользователя', () => {
    return request.get('/movies')
      .set('Cookie', [`jwt=${token}`])
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.movies).toBeDefined();
      });
  });

  it('Не должен удалить фильм, если пользователь не владелец', () => {
    return request.delete(`/movies/${filmId}`)
      .set('Cookie', [`jwt=${strangerToken}`])
      .then(response => {
        expect(response.status).toBe(403);
        expect(response.body.message).toBe(notMovieOwner);
      });
  });

  it('Не должен удалить фильм, если ID некорректный', () => {
    return request.delete('/movies/62d5826be51de656d2e725f8')
      .set('Cookie', [`jwt=${token}`])
      .then(response => {
        expect(response.status).toBe(404);
        expect(response.body.message).toBe(noMovieById);
      });
  });

  it('Должен удалить фильм, если ID корректный и пользователь - владелец', () => {
    return request.delete(`/movies/${filmId}`)
      .set('Cookie', [`jwt=${token}`])
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(movieRemovingSuccess);
      });
  });
});
