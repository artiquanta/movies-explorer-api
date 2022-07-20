const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Конфигурация helmet
module.exports.helmetConfig = helmet({
  hsts: false,
});

// Конфигурация Rate Limit для общих запросов
module.exports.rateLimitConfig = rateLimit({
  windowMs: 450000,
  max: 250,
  message: {
    message: 'Слишком много запросов с одного IP. Попробуйте позже, через 7.5 минут',
  },
});

// Конфигурация Rate Limit для запросов на регистрацию, авторизацию, выход из системы
module.exports.rateLimitConfigAuth = rateLimit({
  windowMs: 300000,
  max: 10,
  message: {
    message: 'Слишком много попыток авторизации с одного IP. Попробуйте позже, через 5 минут',
  },
});
