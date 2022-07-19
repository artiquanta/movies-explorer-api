/* eslint-env jest */
const mongoose = require('mongoose');
const supertest = require('supertest');
const { sign } = require('jsonwebtoken');

const app = require('../app');

const request = supertest(app);

const { userData } = require('../fixtures/index');
const User = require('../models/user');
const {
  alreadyRegisteredEmail,
  authSuccess,
  wrongPasswordOrEmail,
  logoutMessage,
} = require('../utils/constants');
const { secretKey } = require('../utils/utils');

beforeAll(() => mongoose.connect('mongodb://localhost:27017/moviesdb'));

afterAll(() => mongoose.disconnect());

describe('Проверка создания пользователя', () => {
  it('POST "/signup" должен создавать пользователя и возвращать email и name, но не возвращать password', () => {
    return request.post('/signup').send({
      email: userData.email,
      password: userData.password,
      name: userData.name,
    })
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.email).toBe(userData.email);
        expect(response.body.name).toBe(userData.name);
        expect(response.body.password).toBeUndefined();
      });
  });

  it('Не должен регистрировать, если данные ошибочны', () => {
    return request.post('/signup').send({
      email: 'testemail@testemail.testemail',
      password: '',
      name: 'a',
    })
      .then(response => {
        expect(response.status).toBe(400);
      });
  });

  it('Не должен регистрировать, если email уже есть в базе', () => {
    return request.post('/signup').send({
      email: userData.email,
      password: userData.password,
      name: userData.name,
    })
      .then(response => {
        expect(response.status).toBe(409);
        expect(response.body.message).toBe(alreadyRegisteredEmail);
      });
  });

  it('Удаление пользователя', () => {
    return User.findOneAndRemove({ email: userData.email })
      .then(res => expect(res.email).toBe(userData.email));
  });
});

describe('Проверка авторизация и выхода из системы', () => {
  beforeAll(() => {
    return request.post('/signup').send({
      email: userData.email,
      password: userData.password,
      name: userData.name,
    });
  });

  afterAll(() => {
    return User.deleteOne({ email: userData.email });
  });

  it('Должен сообщать о некорретном email или пароле в случае ошибки', () => {
    return request.post('/signin').send({
      email: userData.email,
      password: 'wrong',
    })
      .then(response => {
        expect(response.status).toBe(401);
        expect(response.body.message).toBe(wrongPasswordOrEmail);
      });
  });

  it('POST "/signin" должен авторизовывать пользователя', () => {
    return request.post('/signin').send({
      email: userData.email,
      password: userData.password,
    })
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(authSuccess);
      });
  });

  it('GET "/logout" должен убирать cookies у пользователя', () => {
    return request.get('/logout')
      .then(response => {
        expect(response.status).toBe(200);
        expect(response.body.message).toBe(logoutMessage);
      });
  });
});

describe('Проверка получения информации о пользователе', () => {
  let userId;
  let token;

  beforeAll(() => {
    return User.create({
      email: userData.email,
      password: userData.password,
      name: userData.name,
    })
      .then(response => {
        userId = response._id.toString();
        token = sign(
          { _id: userId },
          secretKey,
          { expiresIn: '1d' },
        );
      });
  });

  afterAll(() => {
    return User.findByIdAndRemove(userId);
  });

  describe('Проверка получения информации о пользователе', () => {
    it('Должен возвращать информацию о текущем пользователе', () => {
      return request.get('/users/me')
        .set('Cookie', [`jwt=${token}`])
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body.name).toBe(userData.name);
          expect(response.body.email).toBe(userData.email);
          expect(response.body._id).toBeDefined();
        });
    });

    it('Должен обновлять информацию о пользователе', () => {
      return request.patch('/users/me')
        .set('Cookie', [`jwt=${token}`])
        .send({
          email: userData.testEmail,
          name: userData.testName,
        })
        .then(response => {
          expect(response.status).toBe(200);
          expect(response.body.email).toBe(userData.testEmail);
          expect(response.body.name).toBe(userData.testName);
        });
    });
  });
});
