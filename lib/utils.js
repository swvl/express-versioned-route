const toArray = obj => [].concat(obj || []);

/**
 * @param {*} ranges: is array of arrays
 * [
 *      [startingFromNumber, valueToBeSelected],
 *      [startingFromNumber, valueToBeSelected],
 *      [startingFromNumber, valueToBeSelected]
 * ]
 */
const rangeSelector = ranges => number => {
  const targetRangeIndex = ranges.map(range => number >= range[0]).lastIndexOf(true);
  const targetRange = ranges[targetRangeIndex];
  return targetRange && targetRange[1];
};

/**
 * Note: Conversion to upper or lower case does provide correct case insensitive comparisons
 *  in all languages. For more info: i18nguy.com/unicode/turkish-i18n.html
 * @param {*} lhs left hand side
 */
const insensitiveMatch = lhs => rhs => lhs.toLowerCase() === rhs.toLowerCase();

const getPropByInsensitiveName = obj => propName =>
  obj[Object.keys(obj).find(insensitiveMatch(propName))];

const isSortedArray = arr => arr.slice(1).every((item, i) => arr[i] <= item);
const first = arr => arr[0];

module.exports = {
  toArray,
  rangeSelector,
  getPropByInsensitiveName,
  isSortedArray,
  first,
};
