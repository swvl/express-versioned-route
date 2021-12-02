const { getPropByInsensitiveName } = require('../utils');
const clientModel = require('./clientModel');
const versionModel = require('./versionModel');
const optionsModel = require('./optionsModel');

const reservedProps = ['versions', 'options'];

const parse = (globalOptions, specsDef) => {
  const getSpecProp = getPropByInsensitiveName(specsDef);

  const versionsObj = versionModel.parse(getSpecProp('versions'));
  const options = optionsModel.parse(globalOptions, getSpecProp('options'));
  const clientRangesDefParser = clientModel.parse(versionsObj);
  const clients = Object.keys(specsDef)
    .map((key) => key.toLowerCase())
    .filter((key) => !reservedProps.includes(key))
    .reduce((clientsObj, clientName) => {
      // eslint-disable-next-line no-param-reassign
      clientsObj[clientName] = clientRangesDefParser(getSpecProp(clientName));
      return clientsObj;
    }, {});

  const defaultVersionName = Object.values(versionsObj).find((ver) => ver.isDefault).name;

  return {
    versionsObj,
    defaultVersionName,
    options,
    clients,
  };
};

module.exports = {
  parse,
};
