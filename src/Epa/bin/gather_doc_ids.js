var Container = require('../../app.js');
var client = Container.client;
var request = require('request');

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

request("https://airhound-dev.540.co/api/doc_ids/" + year, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
})

function appendId(id){
  // fs.appendFileSync(output, id)
}


/*
client.search({
  index: _index,
  type: _type,
  size: 0,
  body: {
    "query" : {
        "filtered" : {
            "filter" : {
                "terms" : {
                    "documentControlNumber" : ids
                }
            }
        }
    }
}
}, function(err, response){
  var total = response.hits.total;
  console.log("length: ", ids.length);
  console.log("total: ", total);
  return null;
});

return null;
*/
