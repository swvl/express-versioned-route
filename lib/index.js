const versionsModel = require('./models/versionsModel');
const flatten = require('./polyfills/flatten');

const lowerCase = (str, defaultValue = undefined) => {
  if (!str) return defaultValue;
  return str.toLowerCase();
};

const versionSelectorMiddleware = specs => (req, res, next) => {
  if (req.headers['accept-version']) {
    req.headers['accept-version'] = lowerCase(req.headers['accept-version']);
    return next();
  }

  const osName = lowerCase(req.headers['device-os']);
  const buildNumber = Number.parseInt(req.headers['build-number'] || '0', 10);

  if (specs.clientsRangeSelectors && specs.clientsRangeSelectors[osName]) {
    req.headers['accept-version'] = lowerCase(specs.clientsRangeSelectors[osName](buildNumber));
  }

  return next();
};

const handlerMiddlewareWrapper = versionName => handler => {
  return (req, res, next) => {
    const requestedVersionName = req.headers['accept-version'];
    if (requestedVersionName === versionName) {
      handler(req, res, next);
    } else {
      next();
    }
  };
};

const versionsHandlersMiddlewaresFactory = specs => {
  return flatten(
    Object.values(specs.versionsObj).map(version => {
      return version.handlers.map(handlerMiddlewareWrapper(version.name.toLowerCase()));
    }),
  );
};

const versionsDef = specsDef => {
  const specs = versionsModel.parse(specsDef);
  return [versionSelectorMiddleware(specs), versionsHandlersMiddlewaresFactory(specs)];
};

module.exports = {
  versionsDef,
};
