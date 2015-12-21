var Container = require('../../bootstrap.js');
var client = Container.client;
var fs = require('fs');

var year = process.argv[2];
var _index = 'epa-tri';
var _type = 'records';
var source = __dirname + "/../lib/json/CLEANED_TRI_" + year + "_US.json";
var output = __dirname + "/../lib/json/doc_ids/" + year + ".json";
var bulk_size = 1000;

var json = require(source);

// Reduce
var ids = json.map(function(release){
  return release.documentControlNumber;
});

console.log(ids);
