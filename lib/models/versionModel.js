const predicates = require('../predicates');
const validators = require('../validators');
const utils = require('../utils');

const createUTCDate = (year, month) => new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));

const deprecationQuarterRegexTrans = utils.regexTrans(/^202(\d)-Q([1-4])$/, (ar) => {
  const year = 2020 + Number.parseInt(ar[1], 10);
  const quarter = Number.parseInt(ar[2], 10);
  const startingMonth = (quarter - 1) * 3;
  return createUTCDate(year, startingMonth + 1);
});

const deprecationMonthRegexTrans = utils.regexTrans(/^202(\d)-(\d\d)$/, (ar) => {
  const year = 2020 + Number.parseInt(ar[1], 10);
  const month = Number.parseInt(ar[2], 10);
  if (month >= 1 && month <= 12) {
    return createUTCDate(year, month);
  }
  return undefined;
});

const parseDeprecationDate = (input) => {
  const date = [deprecationQuarterRegexTrans, deprecationMonthRegexTrans]
    .map((regexTrans) => regexTrans(input))
    .find(Boolean);

  return date;
};

const isOptionalDeprecationDate = validators.fieldValidator(
  'Expects a deprecation date (ex: 2020-Q3 or 2020-08)',
  predicates.isString,
  parseDeprecationDate,
);

const isDefaultFlag = (input) => /^default$/.test(input);

const isOptionalDefaultFlag = validators.fieldValidator(
  'Expects default flag',
  predicates.isString,
  isDefaultFlag,
);

const isExpressHandler = predicates.anyOf(
  predicates.isBinaryFunction,
  predicates.isTernaryFunction,
);

const isExpressHandlerValidator = validators.validator(
  'Expects an express handler',
  isExpressHandler,
);

const validate = (versionDef) => {
  const deprecationDate = isOptionalDeprecationDate(utils.first(versionDef));
  const isDefault = isOptionalDefaultFlag(utils.last(versionDef)) !== undefined;
  const handlers = versionDef.slice(deprecationDate ? 1 : 0, isDefault ? -1 : 100);
  handlers.forEach(isExpressHandlerValidator);

  return {
    deprecationDate,
    isDefault,
    handlers,
  };
};

const parse = (versionsDef) => {
  const parsedVersionsObj = {};

  Object.keys(versionsDef).forEach((key) => {
    const versionDef = versionsDef[key];
    const versionObj = validate(versionDef);
    versionObj.name = key;
    parsedVersionsObj[key.toLowerCase()] = versionObj;
  });

  const defaultVersions = Object.values(parsedVersionsObj).filter((obj) => obj.isDefault).length;
  if (defaultVersions !== 1) {
    throw new validators.ValidationError(
      `Expects one default version, actual is: ${defaultVersions}`,
    );
  }

  return parsedVersionsObj;
};

module.exports = {
  parse,
  parseDeprecationDate,
};
