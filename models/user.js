const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');
const { compare } = require('bcryptjs');
const WrongDataError = require('../errors/wrong-data-err');
const { incorrectEmailFormat, wrongPasswordOrEmail } = require('../utils/constants');

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: incorrectEmailFormat,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then(user => {
      if (!user) {
        return Promise.reject(new WrongDataError(wrongPasswordOrEmail));
      }
      return compare(password, user.password)
        .then(matched => {
          if (!matched) {
            return Promise.reject(new WrongDataError(wrongPasswordOrEmail));
          }
          return user;
        });
    });
};

module.exports = model('user', userSchema);
