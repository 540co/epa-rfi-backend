/* istanbul ignore next */

var Container = require('../../app.js');
var client = Container.client;
var mapping = require('../lib/elastic/epa-tri_mapping.json');

var body = mapping['epa-tri'].mappings;

//*/

function callback(err, response){
  if(err) throw err;
  console.log(response);
}

// Create index
client.indices.create({
  index: 'epa-release'
}, function(err, res){
  // if(err) throw err;

  // Add Mapping
  client.indices.putMapping({
    index: 'epa-release',
    type: 'records',
    body: body
  }, callback);
});

//*/
