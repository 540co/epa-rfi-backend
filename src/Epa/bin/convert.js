/* istanbul ignore next */

var Container = require('../../bootstrap.js');
var Converter = Container.Converter;


//*/

var file = "TRI_" + process.argv[2] + "_US";
var sourceFile = __dirname + "/../lib/csv/" + file + ".csv";
var outputFile = __dirname + "/../lib/json/" + file + ".json";


//end_parsed will be emitted once parsing finished
Converter.on("end_parsed", function (jsonArray) {
  console.log('json array made...');
  var jsonString = JSON.stringify( jsonArray );
  console.log('json stringified...')
   require("fs").writeFile(outputFile, jsonString, function(err){
     if (err) throw err;
     console.log('It\'s saved!');
   });
});

//read from file
require("fs").createReadStream(sourceFile).pipe(Converter);

//*/
