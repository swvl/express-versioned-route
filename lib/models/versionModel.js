const predicates = require('../predicates');
const validators = require('../validators');
const utils = require('../utils');

const createUTCDate = (year, month) => new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));

const deprecationQuarterRegexTrans = utils.regexTrans(/^202(\d)-Q([1-4])$/, ar => {
  const year = 2020 + Number.parseInt(ar[1], 10);
  const quarter = Number.parseInt(ar[2], 10);
  const startingMonth = (quarter - 1) * 3;
  return createUTCDate(year, startingMonth + 1);
});

const deprecationMonthRegexTrans = utils.regexTrans(/^202(\d)-(\d\d)$/, ar => {
  const year = 2020 + Number.parseInt(ar[1], 10);
  const month = Number.parseInt(ar[2], 10);
  if (month >= 1 && month <= 12) {
    return createUTCDate(year, month);
  }
  return undefined;
});

const isDeprecationDate = predicates.anyOf(
  deprecationQuarterRegexTrans,
  deprecationMonthRegexTrans,
);

const isExpressHandler = predicates.anyOf(
  predicates.isBinaryFunction,
  predicates.isTernaryFunction,
);

const isExpressHandlerOrDeprecationDate = predicates.anyOf(isExpressHandler, isDeprecationDate);

const isExpressHandlerOrDeprecationDateValidator = validators.validator(
  'Expects an express handler or a deprecation date (ex: 2020-Q3 or 2020-08)',
  isExpressHandlerOrDeprecationDate,
);

const isExpressHandlerValidator = validators.validator(
  'Expects an express handler',
  isExpressHandler,
);

const validate = validators.validateArrayMembers(
  [isExpressHandlerOrDeprecationDateValidator, isExpressHandlerValidator],
  isExpressHandlerValidator,
);

const parseDeprecationDate = input => {
  const date = [deprecationQuarterRegexTrans, deprecationMonthRegexTrans]
    .map(regexTrans => regexTrans(input))
    .find(Boolean);

  return date;
};

const parseHandlers = inputAr => inputAr.filter(isExpressHandler);

const parse = versionsDef => {
  const parsedVersionsObj = {};

  Object.keys(versionsDef).forEach(key => {
    const versionDef = versionsDef[key];
    validate(versionDef);

    parsedVersionsObj[key.toLowerCase()] = {
      name: key,
      depreciationDate: parseDeprecationDate(versionDef[0]),
      handlers: parseHandlers(versionDef),
    };
  });

  return parsedVersionsObj;
};

module.exports = {
  parse,
  parseDeprecationDate,
};
