const router = require('express').Router();

const { NOT_FOUND_CODE } = require('../utils/utils');

// Регистрация и авторизация пользователя
router.use('/', require('./auth'));

// Проверка авторизации
router.use(require('../middlewares/auth'));

router.use('/users', require('./users'));

router.use('/movies', require('./movies'));

// Страница не найдена
router.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({
    message: 'Страница не найдена, проверьте ссылку',
  });
});

module.exports = router;
