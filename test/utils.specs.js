const { describe, it } = require('mocha');
const { expect } = require('chai');
const clone = require('rfdc')();
const { toArray, peekAsJson, regexTrans } = require('../lib/utils');

const expectDeepEquals = test =>
  it(test.title, () => {
    return expect(test.output).to.deep.equals(test.expectedOutput);
  });

describe('Utils', () => {
  describe('toArray', () => {
    [
      ['10', ['10']],
      ['"aa"', ['"aa"']],
      [10, [10]],
      ['{a: 11}', ['{a: 11}']],
      [{ name: 'NAME', age: 22 }, [{ name: 'NAME', age: 22 }]],
      [
        [4, 5, 7],
        [4, 5, 7],
      ],
      [
        ['a', 11, '{a: 11, b: 22}', { name: 'NAME', age: 22 }],
        ['a', 11, '{a: 11, b: 22}', { name: 'NAME', age: 22 }],
      ],
      [null, []],
      [undefined, []],
    ]
      .map(testAr => {
        return {
          title: JSON.stringify(testAr[0]) || 'undefined',
          output: toArray(testAr[0]),
          expectedOutput: testAr[1],
        };
      })
      .forEach(expectDeepEquals);
  });

  describe('peekAsJson', () => {
    [
      '10',
      '"aa"',
      10,
      '{a: 11}',
      { name: 'NAME', age: 22 },
      [4, 5, 7],
      ['a', 11, '{a: 11, b: 22}', { name: 'NAME', age: 22 }],
    ]
      .map(data => {
        return {
          title: JSON.stringify(data),
          output: peekAsJson()(data),
          expectedOutput: clone(data),
        };
      })
      .forEach(expectDeepEquals);
  });

  describe('regexTrans', () => {
    const regexTransThatThrowsError = regexTrans(/^he(l{2,})o$/, ar => {
      throw new Error('random error', ar);
    });

    ['hello', 'helllllo', 'help', 22]
      .map((data, index) => {
        return {
          title: `Test case #${index + 1}`,
          input: clone(data),
        };
      })
      .forEach(test => {
        it(test.title, () => {
          expect(() => regexTransThatThrowsError(test.input)).to.not.throw();
        });
      });
  });
});
