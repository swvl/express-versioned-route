const clone = require('rfdc')();
const { describe, it } = require('mocha');
const request = require('supertest');
const { expect } = require('chai');
const app = require('express')();
const { versionsDef } = require('../index');

const removeEmptyProps = input => {
  const obj = clone(input);
  Object.keys(obj).forEach(key => (obj[key] === undefined ? delete obj[key] : {}));
  return obj;
};

describe('Example 1', () => {
  const process = (name, req) => {
    if (!req.processingOrder) {
      req.processingOrder = [];
    }
    req.processingOrder.push(name);
  };
  const mwDef = name => (req, res, next) => {
    process(name, req);
    next();
  };
  const searchHandler = version => (req, res) => {
    process(version, req);
    res.status(200).send(JSON.stringify(req.processingOrder));
  };

  const mw1 = mwDef('mw1');
  const mw2 = mwDef('mw2');
  const searchMW1 = mwDef('searchMW1');
  const searchMW2 = mwDef('searchMW2');
  const dynamicSearchMW1 = mwDef('dynamicSearchMW1');
  const dynamicSearchMW2 = mwDef('dynamicSearchMW2');
  const deepSearchMW = mwDef('deepSearchMW');

  const searchHandlerV1 = searchHandler('v1');
  const searchHandlerV2 = searchHandler('v2');
  const searchHandlerV3 = searchHandler('v3');
  const searchHandlerV4 = searchHandler('v4');

  const searchVersionDef = versionsDef({
    versions: {
      simpleSearch: ['2020-Q1', searchMW1, searchMW2, searchHandlerV1],
      dynamicSearch: [dynamicSearchMW1, dynamicSearchMW2, searchHandlerV2],
      superSearch: [searchHandlerV3],
      deepSearch: [deepSearchMW, searchHandlerV4],
    },
    Android: [
      [400, 'simpleSearch'],
      [450, 'dynamicSearch'],
      [500, 'superSearch'],
    ],
    iOS: [
      [400, 'simpleSearch'],
      [460, 'dynamicSearch'],
    ],
  });

  // TODO: instead of running mocha with exit flag, terminate express at the end
  app.get('/search', mw1, mw2, searchVersionDef);

  const runTestCase = test =>
    it(test.title, done => {
      request(app)
        .get('/search')
        .set(removeEmptyProps(test.config))
        .expect(test.expectedResponseCode)
        .end((err, res) => {
          if (!test.shouldSuccess) return done();
          if (err) return done(err);
          expect(res.text).to.equal(test.expectedResponse);
          return done();
        });
    });

  describe('mobile headers', () => {
    [
      [undefined, undefined, false],
      ['android', undefined, false],
      ['windows', undefined, false],
      ['windows', 100, false],
      ['windows', 400, false],
      ['windows', 999, false],

      ['Android', undefined, false],
      ['Android', 100, false],
      ['Android', 300, false],
      ['Android', 399, false],
      ['Android', 400, true, ['mw1', 'mw2', 'searchMW1', 'searchMW2', 'v1']],
      ['Android', 401, true, ['mw1', 'mw2', 'searchMW1', 'searchMW2', 'v1']],
      ['Android', 440, true, ['mw1', 'mw2', 'searchMW1', 'searchMW2', 'v1']],
      ['Android', 449, true, ['mw1', 'mw2', 'searchMW1', 'searchMW2', 'v1']],
      ['Android', 450, true, ['mw1', 'mw2', 'dynamicSearchMW1', 'dynamicSearchMW2', 'v2']],
      ['Android', 451, true, ['mw1', 'mw2', 'dynamicSearchMW1', 'dynamicSearchMW2', 'v2']],
      ['Android', 499, true, ['mw1', 'mw2', 'dynamicSearchMW1', 'dynamicSearchMW2', 'v2']],
      ['Android', 500, true, ['mw1', 'mw2', 'v3']],
      ['Android', 501, true, ['mw1', 'mw2', 'v3']],
      ['Android', 550, true, ['mw1', 'mw2', 'v3']],
      ['android', 999, true, ['mw1', 'mw2', 'v3']],
      ['AndroiD', 999, true, ['mw1', 'mw2', 'v3']],
      ['AnDrOid', 999, true, ['mw1', 'mw2', 'v3']],
      ['android', 999, true, ['mw1', 'mw2', 'v3']],

      ['iOS', undefined, false],
      ['iOS', 100, false],
      ['iOS', 300, false],
      ['iOS', 399, false],
      ['iOS', 400, true, ['mw1', 'mw2', 'searchMW1', 'searchMW2', 'v1']],
      ['iOS', 401, true, ['mw1', 'mw2', 'searchMW1', 'searchMW2', 'v1']],
      ['iOS', 440, true, ['mw1', 'mw2', 'searchMW1', 'searchMW2', 'v1']],
      ['iOS', 459, true, ['mw1', 'mw2', 'searchMW1', 'searchMW2', 'v1']],
      ['iOS', 460, true, ['mw1', 'mw2', 'dynamicSearchMW1', 'dynamicSearchMW2', 'v2']],
      ['iOS', 461, true, ['mw1', 'mw2', 'dynamicSearchMW1', 'dynamicSearchMW2', 'v2']],
      ['iOS', 499, true, ['mw1', 'mw2', 'dynamicSearchMW1', 'dynamicSearchMW2', 'v2']],
      ['ios', 999, true, ['mw1', 'mw2', 'dynamicSearchMW1', 'dynamicSearchMW2', 'v2']],
      ['IOS', 999, true, ['mw1', 'mw2', 'dynamicSearchMW1', 'dynamicSearchMW2', 'v2']],
      ['ioS', 999, true, ['mw1', 'mw2', 'dynamicSearchMW1', 'dynamicSearchMW2', 'v2']],
      ['IoS', 999, true, ['mw1', 'mw2', 'dynamicSearchMW1', 'dynamicSearchMW2', 'v2']],
    ]
      .map(testAr => {
        return {
          title: `${testAr[0]}-${testAr[1]} should processed by ${testAr[2] ? testAr[3] : '404'}`,
          config: {
            'device-os': testAr[0],
            'build-number': testAr[1],
          },
          shouldSuccess: testAr[2],
          expectedResponseCode: testAr[2] ? 200 : 404,
          expectedResponse: JSON.stringify(testAr[3]),
        };
      })
      .forEach(runTestCase);
  });

  describe('accept-version header', () => {
    [
      ['simpleSearch', true, ['mw1', 'mw2', 'searchMW1', 'searchMW2', 'v1']],
      ['dynamicSearch', true, ['mw1', 'mw2', 'dynamicSearchMW1', 'dynamicSearchMW2', 'v2']],
      ['superSearch', true, ['mw1', 'mw2', 'v3']],
      ['deepSearch', true, ['mw1', 'mw2', 'deepSearchMW', 'v4']],
    ].forEach(testCase => {
      const newTestCases = [clone(testCase), clone(testCase), clone(testCase)];
      newTestCases[1][0] = newTestCases[1][0].toLowerCase();
      newTestCases[2][0] = newTestCases[2][0].toUpperCase();
      newTestCases
        .map(testAr => {
          return {
            title: `${testAr[0]} should processed by ${testAr[1] ? testAr[2] : '404'}`,
            config: {
              'accept-version': testAr[0],
            },
            shouldSuccess: testAr[1],
            expectedResponseCode: testAr[1] ? 200 : 404,
            expectedResponse: JSON.stringify(testAr[2]),
          };
        })
        .forEach(runTestCase);
    });
  });
});
