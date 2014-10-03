// modified from
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
var keys = Object.keys || (function () {
  var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
      dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      dontEnumsLength = dontEnums.length;

  return function keys(obj) {
    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
      throw new TypeError('Object.keys called on non-object');
    }

    var result = [], i;
    if (hasDontEnumBug) {
      for (i = 0; i < dontEnumsLength; i++) {
        if (hasOwnProperty.call(obj, dontEnums[i])) {
          result.push(dontEnums[i]);
        }
      }
    }
    return result;
  };
}());

var slice = Array.prototype.slice;

var merge = function (target) {
  var mixins = slice.call(arguments, 1);
  for (var i = 0, len = mixins.length; i < len; i++) {
    var mixin = mixins[i] || {};
    var mixinKeys = keys(mixin);
    for (var j = 0, jLen = mixinKeys.length; j < jLen; j++) {
      var key = mixinKeys[j];
      target[key] = mixin[key];
    }
  }
  return target;
};

var pluck = function (object, array) {
  var pluckedProperties = {};
  for (var i = 0, len = array.length; i < len; i++) {
    var property = array[i];
    pluckedProperties[property] = object[property];
  }
  return pluckedProperties;
};

export { keys, merge, pluck };
