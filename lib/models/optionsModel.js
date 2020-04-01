const defaultOptions = {
  // eslint-disable-next-line no-unused-vars
  onDeprecated: (versionName, req) => {
    console.warn(`WARNING: received a call to a deprecated version: ${versionName}`);
  },
  allowClientRequestFallbackToDefaultVersion: true,
  onClientSelection: req => {
    const name = req.headers['device-os'];
    const buildNumber = Number.parseInt(req.headers['build-number'] || '0', 10);

    return {
      name,
      buildNumber,
    };
  },
};

const parse = (globalOptions, localOptions) => {
  const finalOptions = {};
  Object.assign(finalOptions, defaultOptions, globalOptions, localOptions);
  return finalOptions;
};

module.exports = {
  parse,
};
