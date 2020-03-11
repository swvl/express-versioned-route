const { getPropByInsensitiveName } = require('../utils');
const clientModel = require('./clientModel');
const versionModel = require('./versionModel');

const parse = specsDef => {
  const getSpecProp = getPropByInsensitiveName(specsDef);

  const versionsObj = versionModel.parse(getSpecProp('versions'));
  const clientRangesDefParser = clientModel.parse(versionsObj);
  const clients = Object.keys(specsDef)
    .map(key => key.toLowerCase())
    .filter(key => key !== 'versions')
    .reduce((clientsObj, clientName) => {
      // eslint-disable-next-line no-param-reassign
      clientsObj[clientName] = clientRangesDefParser(getSpecProp(clientName));
      return clientsObj;
    }, {});

  return {
    versionsObj,
    clients,
  };
};

module.exports = {
  parse,
};
