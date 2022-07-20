const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const { NODE_ENV, DB_ADDRESS } = process.env;

const { logRequest, logError } = require('./middlewares/logger');
const { helmetConfig, rateLimitConfig } = require('./utils/security');

const app = express();

// Подключение helmet
app.use(helmetConfig);

// Ограничение частоты запросов
app.use(rateLimitConfig);

// Подключение парсеров
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Логирование запросов
app.use(logRequest);

// CORS
app.use(require('./middlewares/cors'));

// Маршруты
app.use(require('./routes/index'));

// Логирование ошибок
app.use(logError);

// Обработчик ошибок валидации celebrate
app.use(require('./middlewares/celebrateErrorHandler'));

// Централизованный обработчик ошибок
app.use(require('./middlewares/errorHandler'));

mongoose.connect(`mongodb://${NODE_ENV === 'production' ? DB_ADDRESS : 'localhost:27017'}/moviesdb`);

module.exports = app;
