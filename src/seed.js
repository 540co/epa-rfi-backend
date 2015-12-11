var factory = require(__dirname + '/lib/factories/factories.js');
var Container = require(__dirname + '/bootstrap.js');

var repo = Container.resolve('RecordsRepository');

//*/
var people = factory.times(3).make('Person');

people.forEach(function(person){
  repo.save('people', person, function(e,r){});
});
//*/

/*/
var client = Container.resolve('client');

client.indices.create({
  index: 'events'
}, function(e, res){
  client.indices.putMapping({
    index: 'events',
    type: 'patches',
    body: {
      properties: {
        up: {
          properties: {
            value: {type: 'string'}
          }
        },
        down: {
          properties: {
            value: {type: 'string'}
          }
        }
      }
    }
  }, function(e, res){
    if(e){
      console.log('e: ', e);
    }
    else{
      console.log("success");
    }
  });
});
//*/
