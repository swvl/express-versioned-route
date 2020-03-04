/* eslint-disable no-console */
// eslint-disable-next-line import/no-unresolved
const app = require('express')();
const { versionsDef } = require('../index');

const port = 8000;

const mwDef = name => (req, res, next) => {
  console.log(` > Middleware: ${name}`);
  next();
};

const mw1 = mwDef('general purpose mw 1');
const mw2 = mwDef('general purpose mw 2');
const searchMW1 = mwDef('search mw1');
const searchMW2 = mwDef('search mw2');
const dynamicSearchMW1 = mwDef('dynamic search mw1');
const dynamicSearchMW2 = mwDef('dynamic search mw2');

const searchHandlerV1 = (req, res, next) => {
  res.status(200).send('search handler v1');
};

const searchHandlerV2 = (req, res) => {
  res.status(200).send('search handler v2');
};

const searchHandlerV3 = (req, res) => {
  res.status(200).send('search handler v3');
};

const searchHandlerV4 = (req, res) => {
  res.status(200).send('search handler v3');
};

// curl -s -H 'accept-version: dynamicSearch' localhost:8000/search
// curl -s -H 'accept-version: superSearch' localhost:8000/search
// curl -s -H 'accept-version: superSearch' localhost:8000/search

const searchVersionDef = versionsDef({
  versions: {
    simpleSearch: ['2020-Q1', searchMW1, searchMW2, searchHandlerV1],
    dynamicSearch: [dynamicSearchMW1, dynamicSearchMW2, searchHandlerV2],
    superSearch: [searchHandlerV3],
    deepSearch: [searchHandlerV4],
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

app.get('/search', mw1, mw2, searchVersionDef);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
