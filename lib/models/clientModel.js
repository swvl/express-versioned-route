const { rangeSelector, isSortedArray, first } = require('../utils');
const predicates = require('../predicates');
const validators = require('../validators');

const mobileBuildNumberRegex = /^(\d{3})$/;
const isMobileBuildNumber = str => mobileBuildNumberRegex.test(str);
const isMobileBuildNumberValidator = validators.validator(
  'invalid mobile build number',
  isMobileBuildNumber,
);

const isValidVersionValidator = versions =>
  validators.validator('invalid version name', predicates.isInsensitiveKeyAtObject(versions));

const validate = versionsObj =>
  validators.validateArrayMembers([
    isMobileBuildNumberValidator,
    isValidVersionValidator(versionsObj),
  ]);

const validateVersionsSequence = validators.validator(
  'build numbers are not sequential',
  clientRangesDefAr => isSortedArray(clientRangesDefAr.map(first)),
);

const parse = versionsObj => clientRangesDefAr => {
  clientRangesDefAr.forEach(validate(versionsObj));
  validateVersionsSequence(clientRangesDefAr);

  return rangeSelector(clientRangesDefAr);
};

module.exports = {
  parse,
};
