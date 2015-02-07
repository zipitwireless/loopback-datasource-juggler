var Query = require('../lib/connectors/query');
var should = require('should');

describe('Query', function() {

  describe('compare()', function() {
    it('should support number to number comparison', function() {
      Query.compare(1, 2).should.lessThan(0);
      Query.compare(2, 1).should.greaterThan(0);
      Query.compare(2, 2).should.equal(0);
    });

    it('should return NaN if two types are not the same', function() {
      Query.compare(1, '2').should.be.NaN;
      Query.compare(2, '10').should.be.NaN;
      Query.compare(2, '1').should.be.NaN;
      Query.compare(2, '2').should.be.NaN;
      Query.compare('1', 2).should.be.NaN;
      Query.compare('2', 10).should.be.NaN;
      Query.compare('2', 1).should.be.NaN;
      Query.compare('2', 2).should.be.NaN;
      Query.compare('2', true).should.be.NaN;
      Query.compare(false, 0).should.be.NaN;
    });

    it('should support number to undefined/null comparison', function() {
      Query.compare(1, undefined).should.be.NaN;
      Query.compare(1, null).should.be.NaN;
    });

    it('should support number to NaN comparison', function() {
      Query.compare(1, NaN).should.be.NaN;
      Query.compare(1, 'x').should.be.NaN;
    });

    it('should support undefined/null to number comparison', function() {
      Query.compare(undefined, 1).should.be.NaN;
      Query.compare(null, 1).should.be.NaN;
    });

    it('should support string to string comparison', function() {
      Query.compare('abc', 'bd').should.lessThan(0);
      Query.compare('A', 'B').should.lessThan(0);
      Query.compare('A', 'abc').should.lessThan(0);
      Query.compare('abc', 'ab').should.greaterThan(0);
      Query.compare('a', 'a').should.equal(0);
      Query.compare('2', '2').should.equal(0);
      Query.compare('2', '10').should.greaterThan(0);
      Query.compare('2', 'ab').should.lessThan(0);
    });

    it('should support boolean to boolean comparison', function() {
      Query.compare(true, true).should.equal(0);
      Query.compare(false, true).should.lessThan(0);
      Query.compare(true, false).should.greaterThan(0);
      Query.compare(false, false).should.equal(0);
    });
  });

  describe('evaluate()', function() {
    it('should returns true if the expression is equal to the value',
      function() {
        Query.evaluate('xyz', 'xyz').should.be.true;
        Query.evaluate(1, 1).should.be.true;
        Query.evaluate(true, true).should.be.true;
        Query.evaluate(false, false).should.be.true;
      });
  });
});
