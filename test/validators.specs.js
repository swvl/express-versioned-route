const { describe, it } = require('mocha');
const { expect } = require('chai');
const {
  ValidationError,
  validValidator,
  invalidValidator,
  validator,
  validateArrayMembers,
} = require('../lib/validators');
const predicates = require('../lib/predicates');

const generateTestTitle = input => JSON.stringify(input) || 'undefined';

describe('Validators', () => {
  const data = [
    '10',
    '"aa"',
    10,
    '{a: 11}',
    { name: 'NAME', age: 22 },
    [4, 5, 7],
    ['a', 11, '{a: 11, b: 22}', { name: 'NAME', age: 22 }],
    null,
    undefined,
  ];

  describe('validValidator', () => {
    data.forEach(test => {
      return it(generateTestTitle(test), () => {
        expect(() => validValidator(test)).to.not.throw();
      });
    });
  });

  describe('invalidValidator', () => {
    data.forEach(test => {
      return it(generateTestTitle(test), () => {
        expect(() => invalidValidator(test)).to.throw(ValidationError, 'invalid input');
      });
    });
  });

  describe('validator', () => {
    it('invalid predicate function', () => {
      const isOldEnoughValidator = validator("user isn't old enough", () => true);
      expect(() => isOldEnoughValidator(80)).to.throw(ValidationError, 'predicate');
    });
  });

  describe('validateArrayMembers', () => {
    const validatorsAr = [
      validator('expects string', predicates.isString),
      validator('expects function', predicates.isFunction),
      validator('expects array', predicates.isArray),
    ];
    const arrayValidator = validateArrayMembers(validatorsAr, null);
    it('invalid data', () => {
      const input = ['abc', () => {}, [], 10];
      expect(() => arrayValidator(input)).to.throw(ValidationError, '10: invalid input');
    });
  });
});
