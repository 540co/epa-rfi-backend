/* istanbul ignore next */

var fs = require('fs');

var year = process.argv[2];
var source = __dirname + "/../lib/json/CLEANED_TRI_" + year + "_US.json";
var output = __dirname + "/../lib/json/LINEAR_TRI_" + year + "_US.txt";

var array = require(source);
// var array = [
//   {index: 0},
//   {index: 1},
//   {index: 2},
//   {index: 3},
//   {index: 4},
//   {index: 5}
// ];


array.forEach(function(obj, index){
  var string = JSON.stringify(obj) + "\n";
  fs.appendFileSync(output, string);
  console.log(index + " written...");
});

console.log("Done!");


// var readable = fs.createReadStream(output, {start: 1, end: 1});
// readable.on('data', function(chunk){
//   console.log(chunk);
// });
