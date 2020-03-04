const { getPropByInsensitiveName } = require('../utils');
const clientModel = require('./clientModel');
const versionModel = require('./versionModel');

const parse = specsDef => {
  const getSpecProp = getPropByInsensitiveName(specsDef);

  const versionsObj = versionModel.parse(getSpecProp('versions'));
  const clientRangesDefParser = clientModel.parse(versionsObj);
  const androidRangeSelector = clientRangesDefParser(getSpecProp('android'));
  const iosRangeSelector = clientRangesDefParser(getSpecProp('ios'));

  return {
    versionsObj,
    clientsRangeSelectors: {
      android: androidRangeSelector,
      ios: iosRangeSelector,
    },
  };
};

module.exports = {
  parse,
};
