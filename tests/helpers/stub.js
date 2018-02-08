'use strict';

module.exports = {
  stub: function stub(obj, name, value, shouldInvoke) {
    let original = obj[name];

    obj[name] = function() {
      obj[name].called++;
      obj[name].calledWith.push(arguments);
      return shouldInvoke ? value.apply(this, arguments) : value;
    };

    obj[name]._restore = function() {
      obj[name] = original;
    };

    obj[name].called = 0;
    obj[name].calledWith = [];
    return obj[name];
  },
  stubPath(path) {
    return {
      basename() {
        return path;
      }
    };
  },
  stubBlueprint: function stubBlueprint() {
    return function Blueprint() {
      return {
        install() { }
      };
    };
  },
  safeRestore(obj, name) {
    let value = obj[name];
    if (value && value._restore) {
      value._restore();
    }
  }
};
