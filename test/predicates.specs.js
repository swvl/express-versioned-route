const { describe, it } = require('mocha');
const { expect } = require('chai');
const predicates = require('../lib/predicates');

describe('predicates', () => {
  describe('', () => {
    const isBinaryMathFunction = predicates.allOf(
      predicates.isFunction,
      predicates.isBinaryFunction,
    );
    it('Math.atan2 should be a valid binary function', () => {
      expect(isBinaryMathFunction(Math.atan2)).to.equal(true);
    });
    it('Math.atanh should not be a valid function', () => {
      expect(isBinaryMathFunction(Math.atanh)).to.equal(false);
    });
  });
});
