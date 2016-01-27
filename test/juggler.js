var should = require('./init.js');
var juggler = require('..');

describe('juggler', function() {
  it('should expose a version number', function() {
    var pkgVersion = require('../package.json').version;
    juggler.version.should.equal(pkgVersion);
  });
});
