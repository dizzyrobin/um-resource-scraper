const kebabToken = '-';
const snakeToken = '_';
const spaceToken = ' ';
const tokens = '.-_ ';

const makeFirstUpper = str => str.charAt(0).toUpperCase() + str.slice(1);
// const isUpperCase = str => (str >= 'A' && str <= 'Z') || str === 'Á' || str === 'É' || str === 'Í' || str === 'Ó' || str === 'Ú';
// const isLoweCase = str => (str >= 'a' && str <= 'z') || str === 'á' || str === 'é' || str === 'í' || str === 'ó' || str === 'ú';
const isUpperCase = str => str !== str.toLowerCase();
const isLoweCase = str => str !== str.toUpperCase();
const joinToken = (a, b, token) => `${a}${token}${b}`;

const joinKebab = (a, b) => joinToken(a, b, kebabToken);
const joinSnake = (a, b) => joinToken(a, b, snakeToken);
const joinSpace = (a, b) => joinToken(a, b, spaceToken);
const joinCamel = (a, b) => `${a}${makeFirstUpper(b)}`;
const joinPascal = (a, b) => `${makeFirstUpper(a)}${makeFirstUpper(b)}`;

const tokenize = (str) => {
  let newStr = str;

  const tmpToken = '-';

  const StateEnum = {
    start: 0,
    firstLower: 1,
    firstUpper: 2,
    isLower: 3,
    isUpper: 4,
    isUnknown: 6,
  };

  tokens.split('').forEach((t) => {
    newStr = newStr.split(t).filter(e => e !== '').join(tmpToken);
  });


  let state = StateEnum.start;
  newStr = newStr.split('').reduce((prev, letter) => {
    if (letter === tmpToken) {
      state = StateEnum.start;
      return prev + tmpToken;
    }

    switch (state) {
      case StateEnum.start:
        if (isLoweCase(letter)) {
          state = StateEnum.firstLower;
        } else if (isUpperCase(letter)) {
          state = StateEnum.firstUpper;
        } else {
          state = StateEnum.isUnknown;
        }
        return prev + letter;
      case StateEnum.firstLower:
        if (isLoweCase(letter)) {
          state = StateEnum.isLower;
          return prev + letter;
        }
        if (isUpperCase(letter)) {
          state = StateEnum.firstUpper;
          return prev + tmpToken + letter;
        }
        state = StateEnum.isUnknown;
        return prev + tmpToken + letter;
      case StateEnum.firstUpper:
        if (isLoweCase(letter)) {
          state = StateEnum.isLower;
          return prev + letter;
        }
        if (isUpperCase(letter)) {
          state = StateEnum.isUpper;
          return prev + letter;
        }
        state = StateEnum.isUnknown;
        return prev + tmpToken + letter;
      case StateEnum.isLower:
        if (isLoweCase(letter)) {
          state = StateEnum.isLower;
          return prev + letter;
        }
        if (isUpperCase(letter)) {
          state = StateEnum.firstUpper;
          return prev + tmpToken + letter;
        }
        state = StateEnum.isUnknown;
        return prev + tmpToken + letter;
      case StateEnum.isUpper:
        if (isLoweCase(letter)) {
          state = StateEnum.firstLower;
          return prev + tmpToken + letter;
        }
        if (isUpperCase(letter)) {
          state = StateEnum.isUpper;
          return prev + letter;
        }
        state = StateEnum.isUnknown;
        return prev + tmpToken + letter;
      case StateEnum.isUnknown:
        if (isLoweCase(letter)) {
          state = StateEnum.firstLower;
          return prev + tmpToken + letter;
        }
        if (isUpperCase(letter)) {
          state = StateEnum.firstUpper;
          return prev + tmpToken + letter;
        }
        state = StateEnum.isUnknown;
        return prev + letter;
      default:
        return prev + letter;
    }
  }, '');

  return newStr.toLowerCase().split(tmpToken);
};

const toCase = (str, joinFunc) => tokenize(str)
  .reduce((prev, word) => (prev === '' ? word : joinFunc(prev, word)), '');

module.exports.toCamel = str => toCase(str, joinCamel);
module.exports.toPascal = str => toCase(str, joinPascal);
module.exports.toKebab = str => toCase(str, joinKebab);
module.exports.toSnake = str => toCase(str, joinSnake);
module.exports.toSpace = str => toCase(str, joinSpace);
