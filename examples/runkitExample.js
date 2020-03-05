const app = require('@runkit/runkit/express-endpoint/1.0.0')(exports); // Replace this line by normal express app
const { versionsDef } = require('@swvl/express-versioned-route');

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
  res.status(200).send('search handler v4');
};

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

app.get('/', mw1, mw2, searchVersionDef);

process.env.RUNKIT_ENDPOINT_URL;
