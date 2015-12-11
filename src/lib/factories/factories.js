var factory = require('node-model-factory');

// User
factory.define('Person', function(faker, factory){
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    age: faker.random.arrayElement([35, 36, 37, 38])
  };
});

module.exports = factory;
