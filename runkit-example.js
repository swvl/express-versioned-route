const app = require('@runkit/runkit/express-endpoint/1.0.0')(exports); // Replace this line by a normal express app
const { versionsDef } = require('@swvl/express-versioned-route');

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

const searchVersionDef = versionsDef()({
  versions: {
    simpleSearch: ['2020-Q1', searchMW1, searchMW2, searchHandlerV1],
    dynamicSearch: [dynamicSearchMW1, dynamicSearchMW2, searchHandlerV2, 'default'],
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

app.get('/', mw1, mw2, searchVersionDef);

process.env.RUNKIT_ENDPOINT_URL;
// curl -L -H 'accept-version: supersearch' <runkit-url>
