const { describe, it } = require('mocha');
const { expect } = require('chai');
const { parseDeprecationDate } = require('../../lib/models/versionModel');

const utcDate = (year, month) => new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));

describe('parseDeprecationDate', () => {
  describe('version validation', () => {
    [
      ['2010-Q0'],
      ['2019-Q0'],
      ['2020-Q0'],
      ['2029-Q0'],
      ['2030-Q0'],
      ['2040-Q0'],

      ['2010-Q1'],
      ['2019-Q1'],
      ['2020-Q1', utcDate(2020, 1)],
      ['2029-Q1', utcDate(2029, 1)],
      ['2030-Q1'],
      ['2040-Q1'],

      ['2010-Q4'],
      ['2019-Q4'],
      ['2020-Q4', utcDate(2020, 10)],
      ['2029-Q4', utcDate(2029, 10)],
      ['2030-Q4'],
      ['2040-Q4'],

      ['2010-Q5'],
      ['2019-Q5'],
      ['2020-Q5'],
      ['2029-Q5'],
      ['2030-Q5'],
      ['2040-Q5'],

      ['2010-Q5'],
      ['2019-Q5'],
      ['2020-Q5'],
      ['2029-Q5'],
      ['2030-Q5'],
      ['2040-Q5'],

      ['2019-00'],
      ['2019-01'],
      ['2019-12'],
      ['2019-13'],

      ['2020-00'],
      ['2020-01', utcDate(2020, 1)],
      ['2020-12', utcDate(2020, 12)],
      ['2020-13'],

      ['2029-00'],
      ['2029-01', utcDate(2029, 1)],
      ['2029-12', utcDate(2029, 12)],
      ['2029-13'],

      ['2030-00'],
      ['2030-01'],
      ['2030-12'],
      ['2030-13'],
    ]
      .map((testAr) => ({
        title: `${testAr[0]} should be ${testAr[1] ? 'valid' : 'invalid'}`,
        input: [testAr[0]],
        expectOutput: testAr[1] && testAr[1].getTime(),
      }))
      .forEach((test) => {
        it(test.title, () => {
          const output = parseDeprecationDate(test.input);
          expect(output && output.getTime()).to.equals(test.expectOutput);
        });
      });
  });
});
