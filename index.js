exports.ModelBuilder = exports.LDL = require('loopback-model/lib/model-builder');
exports.DataSource = exports.Schema = require('./lib/datasource.js').DataSource;
exports.ModelBaseClass = require('./lib/model.js');
exports.GeoPoint = require('loopback-model').Geo.GeoPoint;
exports.ValidationError = require('loopback-model/lib/validations').ValidationError;

Object.defineProperty(exports, 'version', {
  get: function() {return require('./package.json').version;}
});

var commonTest = './test/common_test';
Object.defineProperty(exports, 'test', {
  get: function() {return require(commonTest);}
});

exports.Transaction = require('loopback-connector').Transaction;
