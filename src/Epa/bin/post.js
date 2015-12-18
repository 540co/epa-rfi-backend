
var Container = require('../../bootstrap.js');
var Repo = Container.EpaRepository;

var year = process.argv[2];

var file = "CLEANED_TRI_" + year + "_US";
var sourceFile = __dirname + "/../lib/json/" + file + ".json";

var json = require(sourceFile);

function postRecord(record, i){
  Repo.save(record, function(err, response){
    if(err){
      console.log("Error for element "+ i +": ", err);
    }
    console.log("posted " + i + "...");
    i++;
    postRecord(json[i], i);
  });
}

postRecord(json[0], 0);
console.log("Done!");
