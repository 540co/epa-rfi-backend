var Container = require('../../app.js');
var client = Container.client;
var request = require('request');
var async = require('async');

var year = process.argv[2];
var _index = 'epa-tri';
var _type = 'records';
var source = __dirname + "/../lib/json/CLEANED_TRI_" + year + "_US.json";
var output = __dirname + "/../lib/json/doc_ids/" + year + ".json";
var bulk_size = 1000;

//*/
var json = require(source);

// Reduce
var json_ids = json.map(function(release){
  return release.documentControlNumber;
});
//*/


var limit = 10000;
var offset = 0;
var total = {
  ids: [],
  add: function(array){
    this.ids = this.ids.concat(array);
  }
};


function getIds(year, idlimit, offset, callback){
  var query = "idlimit=" + idlimit + "&offset=" + offset;
  request("https://airhound-dev.540.co/api/doc_ids/" + year + "?" + query, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body).data;
      callback(data);
      return;
    }else{
      throw error;
    }
  });
}


function makeRequestsArray(){
  var tasks = [];

  for(var i = 1; i < 3; i++){
    tasks.push(function(callback){
      var limit = i * 10000;
      var offset = i * 10000 - 10000;
      getIds(year, limit, offset, function (data){
          total.add(data);
          callback();
      });
    });
  }

  return tasks;
}


function findIdsThatDoNotMatch(arrayLarge, arraySmall){
  return arrayLarge.filter(function(id){
    return arraySmall.indexOf(id) < 0;
  });
}


//*/
async.parallel([
  function(callback){
    getIds(year, 10000, 0, function (data){
        total.add(data);
        callback();
    });
  },
  function(callback){
    getIds(year, 10000, 10000, function (data){
        total.add(data);
        callback();
    });
  }
], function(err){
    if(err) throw err;
    var ids = findIdsThatDoNotMatch(json_ids, total.ids);
    console.log(ids);
    return;
});
//*/
