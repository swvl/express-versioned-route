const predicates = require('../predicates');
const validators = require('../validators');

const deprecationQuarterRegex = /^202(\d)-Q([1-4])$/;

const isDeprecationQuarter = predicates.allOf(predicates.isString, str =>
  deprecationQuarterRegex.test(str),
);

const isExpressHandler = predicates.anyOf(
  predicates.isBinaryFunction,
  predicates.isTernaryFunction,
);

const isExpressHandlerOrDeprecationQuarter = predicates.anyOf(
  isExpressHandler,
  isDeprecationQuarter,
);

const isExpressHandlerOrDeprecationQuarterValidator = validators.validator(
  'Expects an express handler or a deprecation quarter date (ex: 2020-Q3)',
  isExpressHandlerOrDeprecationQuarter,
);

const isExpressHandlerValidator = validators.validator(
  'Expects an express handler',
  isExpressHandler,
);

const validate = validators.validateArrayMembers(
  [isExpressHandlerOrDeprecationQuarterValidator, isExpressHandlerValidator],
  isExpressHandlerValidator,
);

const parseDeprecationQuarter = inputAr => {
  const input = inputAr[0];
  if (!isDeprecationQuarter(input)) return undefined;

  return deprecationQuarterRegex.exec(input);
};

const parseHandlers = inputAr => inputAr.filter(isExpressHandler);

const parse = versionsDef => {
  const parsedVersionsObj = {};

  Object.keys(versionsDef).forEach(key => {
    const versionDef = versionsDef[key];
    validate(versionDef);

    parsedVersionsObj[key] = {
      name: key,
      depreciationDate: parseDeprecationQuarter(versionDef),
      handlers: parseHandlers(versionDef),
    };
  });

  return parsedVersionsObj;
};

module.exports = {
  parse,
};
