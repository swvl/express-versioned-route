const defaultOptions = {
  allowClientRequestFallbackToDefaultVersion: true,
  onClientSelection: (req) => ({
    name: req.headers['device-os'],
    buildNumber: req.headers['build-number'],
  }),
};

const parse = (globalOptions, localOptions) => {
  const finalOptions = {};
  Object.assign(finalOptions, defaultOptions, globalOptions, localOptions);
  return finalOptions;
};

module.exports = {
  parse,
};
