const secretKey = '7e55f3f81298492acb431f4706de975af5345612165fa416ee32a357f320bc8f';
const urlPattern = /^(https?:\/\/)?([\w.-]+)\.([a-z.]{2,30}\.?)(\/[-_~:/?#[\]@!$&'()*+,;=\w.]*)?\/?$/i;

// Шаблоны сообщений ошибок Celebrate
const celebrateErrors = {
  'string.base': '{#label} не соответствуют требуемому типу данных',
  'string.empty': '{#label} не может быть пустым',
  'string.min': '{#label} должен иметь минимальную длину - {#limit}',
  'string.max': '{#label} должен иметь максимальную длину - {#limit}',
  'string.email': 'Указан некорректный формат email',
  'string.pattern.base': '{#label} имеет некорректный формат данных. Проверьте данные и повторите запрос!',
  'object.unknown': 'поле {#label} запрещено',
  'any.required': '{#label} обязательно!',
};

const NOT_FOUND_CODE = 404;
const DEFAULT_ERROR_CODE = 500;

// Разрешённые домены
const allowedCors = [
  'http://movielibrary.nomoredomains.xyz:3000',
  'https://movielibrary.nomoredomains.xyz:3000',
  'http://localhost:3000',
];

// Разрешённые методы
const DEFAULT_ALLOWED_METHODS = 'GET, POST, PATCH, DELETE';

module.exports = {
  secretKey,
  urlPattern,
  celebrateErrors,
  NOT_FOUND_CODE,
  DEFAULT_ERROR_CODE,
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
};
