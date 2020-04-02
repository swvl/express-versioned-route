const specsModel = require('./models/specsModel');
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
  const client = specs.options.onClientSelection(req);
  const clientName = lowerCase(client.name);
  const buildNumber = Number.parseInt(client.buildNumber || '0', 10);

  if (specs.clients && specs.clients[clientName]) {
    let versionName = specs.clients[clientName](buildNumber);
    if (!versionName && specs.options.allowClientRequestFallbackToDefaultVersion) {
      versionName = specs.defaultVersionName;
    }
    req.headers['accept-version'] = lowerCase(versionName);
    return next();
  }

  // select default version based on specs if found
  req.headers['accept-version'] = lowerCase(specs.defaultVersionName);
  return next();
};

const enabledDeprecationMiddleware = specs => (req, res, next) => {
  const selectedVersionName = req.headers['accept-version'];
  const selectedVersion = specs.versionsObj[selectedVersionName];
  if (selectedVersion && new Date() > selectedVersion.deprecationDate) {
    specs.options.onDeprecated(selectedVersion.name, req);
  }
  next();
};

const disabledDeprecationMiddleware = () => (req, res, next) => next();

const deprecationCheckMiddleware = specs =>
  specs.options.onDeprecated
    ? enabledDeprecationMiddleware(specs)
    : disabledDeprecationMiddleware(specs);

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

const createVersioningHandlers = specs =>
  flatten(Object.values(specs.versionsObj).map(createVersionHandlers));

const versionsDef = globalOptions => specsDef => {
  const specs = specsModel.parse(globalOptions, specsDef);
  return [
    versionSelectorMiddleware(specs),
    deprecationCheckMiddleware(specs),
    createVersioningHandlers(specs),
  ];
};

module.exports = {
  versionsDef,
};
