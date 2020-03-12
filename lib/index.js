const versionsModel = require('./models/versionsModel');
const predicates = require('./predicates');
const flatten = require('./polyfills/flatten');

const lowerCase = (str, defaultValue = undefined) => {
  if (!predicates.isString(str)) return defaultValue;
  return str.toLowerCase();
};

const versionSelectorMiddleware = specs => (req, res, next) => {
  // select version based on: accept-version header
  if (req.headers['accept-version']) {
    req.headers['accept-version'] = lowerCase(req.headers['accept-version']);
    return next();
  }

  // select version based on: device-os & build-number headers
  const osName = lowerCase(req.headers['device-os']);
  const buildNumber = Number.parseInt(req.headers['build-number'] || '0', 10);
  if (specs.clients && specs.clients[osName]) {
    req.headers['accept-version'] = lowerCase(specs.clients[osName](buildNumber));
    return next();
  }

  // select default version based on specs if found
  req.headers['accept-version'] = specs.defaultVersion;
  return next();
};

const deprecationCheckMiddleware = specs => (req, res, next) => {
  const selectedVersionName = req.headers['accept-version'];
  const selectedVersion = specs.versionsObj[selectedVersionName];
  if (selectedVersion && new Date() > selectedVersion.depreciationDate) {
    console.log(`WARNING: received a call to a deprecated version: ${selectedVersion.name}`);
  }
  next();
};

const createHandlerWrapper = versionName => handler => {
  return (req, res, next) => {
    const requestedVersionName = req.headers['accept-version'];
    if (requestedVersionName === versionName) {
      handler(req, res, next);
    } else {
      next();
    }
  };
};

const createVersionHandlers = version =>
  version.handlers.map(createHandlerWrapper(version.name.toLowerCase()));

const createVersioningHandlers = specs => {
  return flatten(Object.values(specs.versionsObj).map(createVersionHandlers));
};

const versionsDef = specsDef => {
  const specs = versionsModel.parse(specsDef);
  return [
    versionSelectorMiddleware(specs),
    deprecationCheckMiddleware(specs),
    createVersioningHandlers(specs),
  ];
};

module.exports = {
  versionsDef,
};
