var _ = require('lodash');

module.exports = Query;

function Query(filter) {
  if (!(this instanceof Query)) {
    return new Query(filter);
  }
  this.filter = this.constructor.getMatcher(filter);
}

Query.prototype.match = function(obj) {
  return this.filter(obj);
};

Query.getMatcher = function getMatcher(filter) {
  var self = this;
  var where = filter.where || {};
  if (typeof where === 'function') {
    return where;
  }
  var keys = Object.keys(where);
  return function(obj) {
    function check(cond) {
      return self.getMatcher({where: cond})(obj);
    }

    var pass = true;
    for (var i = 0, n = keys.length; i < n; i++) {
      var key = keys[i];
      if (key === 'and' || key === 'or') {
        if (Array.isArray(where[key])) {
          if (key === 'and') {
            pass = where[key].every(check);
            return pass;
          }
          if (key === 'or') {
            pass = where[key].some(check);
            return pass;
          }
        }
      }
      if (!self.evaluate(where[key], obj && obj[key])) {
        pass = false;
      }
    }
    return pass;
  };
};

Query.toRegExp = function toRegExp(pattern) {
  if (pattern instanceof RegExp) {
    return pattern;
  }
  var regex = '';
  pattern = _.escapeRegExp(pattern);
  for (var i = 0, n = pattern.length; i < n; i++) {
    var char = pattern.charAt(i);
    if (char === '\\') {
      i++; // Skip to next char
      if (i < n) {
        regex += pattern.charAt(i);
      }
      continue;
    } else if (char === '%') {
      regex += '.*';
    } else if (char === '_') {
      regex += '.';
    } else if (char === '.') {
      regex += '\\.';
    } else if (char === '*') {
      regex += '\\*';
    }
    else {
      regex += char;
    }
  }
  return regex;
};

Query.evaluate = function evaluate(exp, value) {
  if (exp == value) {
    return true;
  }
  if (exp == null) {
    return false;
  }

  if (typeof value === 'string' && (exp instanceof RegExp)) {
    return value.match(exp);
  }

  if (typeof exp === 'object' && exp !== null) {
    // ignore geo near filter
    if (exp.near) {
      return true;
    }

    if (exp.inq) {
      // if (!value) return false;
      for (var i = 0; i < exp.inq.length; i++) {
        if (exp.inq[i] == value || _.isEqual(exp.inq[i], value)) {
          return true;
        }
      }
      return false;
    }

    if ('neq' in exp) {
      return this.compare(exp.neq, value) !== 0;
    }

    if (exp.like || exp.nlike) {

      var like = exp.like || exp.nlike;
      if (typeof like === 'string') {
        like = this.toRegExp(like);
      }
      if (exp.like) {
        return !!new RegExp(like).test(value);
      }

      if (exp.nlike) {
        return !new RegExp(like).test(value);
      }
    }

    if (testInEquality(exp, value)) {
      return true;
    }
  }
  // not strict equality
  return _.isEqual(exp, value);
};

/**
 * Compare two values.
 * @param {*} val1 The 1st value
 * @param {*} val2 The 2nd value
 * @returns {number} 0: =, positive: >, negative <, NaN: unknown
 */
Query.compare = function compare(val1, val2) {
  if (typeof val1 !== typeof val2) {
    return NaN;
  }
  if (val1 == null || val2 == null) {
    // Either val1 or val2 is null or undefined
    return val1 == val2 ? 0 : NaN;
  }
  if (typeof val1 === 'number') {
    return val1 - val2;
  }
  if (typeof val1 === 'string') {
    return (val1 > val2) ? 1 : ((val1 < val2) ? -1 : (val1 == val2) ? 0 : NaN);
  }
  if (typeof val1 === 'boolean') {
    return val1 - val2;
  }
  if (val1 instanceof Date) {
    var result = val1 - val2;
    return result;
  }
  // Return NaN if we don't know how to compare
  return (val1 == val2) ? 0 : NaN;
};

/*!
 * Test if the inequality expression is evaluated to be true against the value
 * @param {Object} exp inequality expression
 * @param {*} val The value
 * @returns {boolean}
 */
function testInEquality(exp, val) {
  if ('gt' in exp) {
    return this.compare(val, exp.gt) > 0;
  }
  if ('gte' in exp) {
    return this.compare(val, exp.gte) >= 0;
  }
  if ('lt' in exp) {
    return this.compare(val, exp.lt) < 0;
  }
  if ('lte' in exp) {
    return this.compare(val, exp.lte) <= 0;
  }
  return false;
}

Query.match = function(filter, value) {
  return new Query(filter).match(value);
};
