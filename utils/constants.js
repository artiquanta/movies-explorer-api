// Сообщения ответов при взаимодействии с пользователем
const incorrectEmailFormat = 'Указан некорректный формат Email';
const wrongUserCreationData = 'Указаны некорректные данные при создании пользователя';
const alreadyRegisteredEmail = 'Указанный Email уже зарегистрирован';
const wrongPasswordOrEmail = 'Некорректные почта или пароль';
const authSuccess = 'Вы успешно авторизовались!';
const authErrorMessage = 'Ошибка авторизации';
const logoutMessage = 'Вы успешно вышли из системы! До скорой встречи! :)';
const noUserById = 'Пользователь по указанному id не найден';
const incorrectUserId = 'Указан некорректный формат id пользователя';
const wrongUserUpdateData = 'Переданы некорректные данные при обновлении пользователя';

// Сообщения ответов при взаимодействии с фильмами
const wrongMovieData = 'Переданы некорректные данные при сохранении фильма';
const noMovieById = 'Фильм с указанным id не был найден';
const notMovieOwner = 'Вы не можете удалить данный фильм, так как он сохранён не Вами';
const movieRemovingSuccess = 'Фильм успешно удалён из сохранённых';

module.exports = {
  incorrectEmailFormat,
  wrongPasswordOrEmail,
  alreadyRegisteredEmail,
  wrongUserCreationData,
  authSuccess,
  authErrorMessage,
  logoutMessage,
  noUserById,
  incorrectUserId,
  wrongUserUpdateData,
  wrongMovieData,
  noMovieById,
  notMovieOwner,
  movieRemovingSuccess,
};
