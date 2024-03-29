const utils = require('./utils');
const predicates = require('./predicates');

class ValidationError extends Error {
  constructor(message, input, context) {
    super(message);
    this.name = 'ValidationError';
    this.context = context;
    this.input = input;
  }

  toString() {
    return JSON.stringify(this, null, 2);
  }
}

const validator = (errorMessage, predicate) => (input, context) => {
  if (!predicates.isUnaryFunction(predicate)) {
    throw new ValidationError('invalid predicate function');
  }

  if (!predicate(input)) {
    throw new ValidationError(`${input}: ${errorMessage}`, input, context);
  }

  return input;
};

const fieldValidator = (errorMessage, evalPredicate, inputMapper) => (input, context) => {
  if (!predicates.isUnaryFunction(evalPredicate)) {
    throw new ValidationError('invalid evalPredicate function');
  }
  if (!predicates.isUnaryFunction(inputMapper)) {
    throw new ValidationError('invalid inputMapper function');
  }

  if (!evalPredicate(input)) return undefined;

  try {
    const result = inputMapper(input);
    if (result === undefined) throw new Error();
    return result;
  } catch (error) {
    throw new ValidationError(`${input}: ${errorMessage}`, input, context);
  }
};

// eslint-disable-next-line no-unused-vars
const validValidator = validator(undefined, (_input) => true);
// eslint-disable-next-line no-unused-vars
const invalidValidator = validator('invalid input', (_input) => false);

const validateArrayMembers = (validators, restValidator) => (input) => {
  const validatorsAr = utils.toArray(validators);

  utils.toArray(input).forEach((arg, index) => {
    (validatorsAr[index] || restValidator || invalidValidator)(arg, index);
  });

  return input;
};

module.exports = {
  ValidationError,
  validator,
  fieldValidator,
  validValidator,
  invalidValidator,
  validateArrayMembers,
};
