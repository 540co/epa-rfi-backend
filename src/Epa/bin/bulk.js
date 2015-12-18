var Container = require('../../bootstrap.js');
var client = Container.client;

var year = process.argv[2];
var _index = 'epa-tri';
var _type = 'records';
var source = __dirname + "/../lib/json/CLEANED_TRI_" + year + "_US.json";
var bulk_size = 1000;

var json = require(source);
console.log("json loaded...");

var pointer = 0;
var length = json.length;
console.log("length: ", length);


function post(json, start, end, callback){
  // make body
  var body = [];

  for(var i = start; i < end; i++){
    body.push({index: {_index: _index, _type: _type}});
    body.push(json[i]);
  }

  client.bulk({
    body: body
  }, function(err, res){
    if(err) throw err;
    console.log("posted: " + start + " to " + (end - 1));
    callback(end);
  });

  delete body;
}

function execute(pointer){
  var start = pointer;
  var end = pointer + bulk_size;

  if(end > length){
    end = length;
  }

  // Execute
  post(json, start, end, function(end_pointer){
    execute(end_pointer);
  });
}

execute(pointer);
