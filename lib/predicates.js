const utils = require('./utils');

const isString = (input) => typeof input === 'string';
const isArray = (input) => Array.isArray(input);
const isFunction = (input) => typeof input === 'function';

const isFunctionWithArgs = (argumentsCount) => (func) =>
  isFunction(func) && argumentsCount === func.length;

const isUnaryFunction = isFunctionWithArgs(1);
const isBinaryFunction = isFunctionWithArgs(2);
const isTernaryFunction = isFunctionWithArgs(3);

const isInsensitiveKeyAtObject = (obj) => (key) =>
  utils.getPropByInsensitiveName(obj)(key) !== undefined;

const anyOf =
  (...predicates) =>
  (arg) =>
    predicates.some((p) => p(arg));
const allOf =
  (...predicates) =>
  (arg) =>
    predicates.every((p) => p(arg));

module.exports = {
  isString,
  isArray,
  isFunction,
  isUnaryFunction,
  isBinaryFunction,
  isTernaryFunction,
  isInsensitiveKeyAtObject,
  anyOf,
  allOf,
};
