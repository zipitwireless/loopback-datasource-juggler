var assert = require('assert');
var DataSource = require('..').DataSource;
var traverse = require('traverse');

var json = {
  name: 'Joe',
  age: 30,
  birthday: new Date(),
  vip: true,
  address: {
    street: '1 Main St',
    city: 'San Jose',
    state: 'CA',
    zipcode: '95131',
    country: 'US'
  },
  friends: ['John', 'Mary'],
  emails: [
    {label: 'work', id: 'x@sample.com'},
    {label: 'home', id: 'x@home.com'}
  ],
  tags: []
};

describe('introspection', function() {
  it('should build a model using DataSource.buildModelFromInstance',
      function(done) {
    var copy = traverse(json).clone();

    var builder = new DataSource('memory');
    var Model = builder.buildModelFromInstance('MyModel', copy,
        {idInjection: false});

    assert.equal(Model.dataSource, builder);

    var obj = new Model(json);
    obj = obj.toObject();
    assert.deepEqual(obj, copy);

    done();
  });
});
