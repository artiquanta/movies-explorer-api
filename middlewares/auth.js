const { verify } = require('jsonwebtoken');
const { secretKey } = require('../utils/utils');
const { authErrorMessage } = require('../utils/constants');
const NotAuthorizedError = require('../errors/not-authorized-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    throw new NotAuthorizedError(authErrorMessage);
  }

  let payload;

  try {
    payload = verify(jwt, NODE_ENV === 'production' ? JWT_SECRET : secretKey);
  } catch (err) {
    throw new NotAuthorizedError(authErrorMessage);
  }

  req.user = payload;
  next();
};
