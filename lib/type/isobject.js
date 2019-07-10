const lodashisObject = require("lodash.isobject")

const isObject = function (value) {
  // avoid function
  return lodashisObject(value) && typeof value !== 'function'
}
module.exports = isObject