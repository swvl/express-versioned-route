const defaultOptions = {
  // eslint-disable-next-line no-unused-vars
  onDeprecated: (versionName, req) => {
    console.log(`WARNING: received a call to a deprecated version: ${versionName}`);
  },
  allowClientRequestFallbackToDefaultVersion: true,
};

const parse = (globalOptions, localOptions) => {
  const finalOptions = {};
  Object.assign(finalOptions, defaultOptions, globalOptions, localOptions);
  return finalOptions;
};

module.exports = {
  parse,
};
