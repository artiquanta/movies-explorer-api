const { Schema, model } = require('mongoose');
const { urlPattern } = require('../utils/utils');

const urlValidation = {
  validator(v) {
    return urlPattern.test(v);
  },
  message: 'Указан некорректный формат ссылки',
};

const movieSchema = new Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: urlValidation,
  },
  trailerLink: {
    type: String,
    required: true,
    validate: urlValidation,
  },
  thumbnail: {
    type: String,
    required: true,
    validate: urlValidation,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRu: {
    type: String,
    required: true,
  },
  nameEn: {
    type: String,
    required: true,
  },
});

module.exports = model('movie', movieSchema);
