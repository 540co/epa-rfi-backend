/* istanbul ignore next */

var year = process.argv[2];
var file = "CLEANED_TRI_" + year + "_US";
var source = __dirname + "/../lib/json/" + file + ".json";

var json = require(source);

console.log(year + " has " + json.length + " records.");

return;
