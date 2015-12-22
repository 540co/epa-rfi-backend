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

/*
var json = require(source);

// Reduce
var ids = json.map(function(release){
  return release.documentControlNumber;
});
*/
// console.log(ids.length);

var limit = 10000;
var offset = 0;
var total = {
  ids: [],
  add: function(array){
    this.ids = this.ids.concat(array);
  }
};


function getIds(year, limit, offset, callback){
  var query = "limit=" + limit + "&offset=" + offset;
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


// getIds(1987, 3, 0, function (data){
//     console.log(data);
// });

//*/
async.parallel([
  function(callback){
    getIds(1987, 3, 0, function (data){
        total.add(data);
        callback();
    });
  },
  function(callback){
    getIds(1987, 3, 3, function (data){
        total.add(data);
        callback();
    });
  }
], function(err){
    if(err) throw err;
    console.log(total.ids);
    return;
});
//*/
