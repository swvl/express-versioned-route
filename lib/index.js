/* eslint-disable no-console */
const versionsModel = require('./models/versionsModel');
const flatten = require('./polyfills/flatten');

const versionSelectorMiddleware = specs => (req, res, next) => {
  if (req.headers['accept-version']) {
    req.headers['accept-version'] = req.headers['accept-version'].toLowerCase();
    return next();
  }

  const mobileHeader = req.headers.mobile;
  if (!mobileHeader) return next();

  const result = mobileHeader.toLowerCase().split('-');

  const osName = result[0];
  const buildNumber = Number.parseInt(result[1], 10);

  if (specs.clientsRangeSelectors && specs.clientsRangeSelectors[osName]) {
    req.headers['accept-version'] = specs.clientsRangeSelectors[osName](buildNumber);
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
