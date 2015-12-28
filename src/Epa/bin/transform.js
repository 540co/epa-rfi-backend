/* istanbul ignore next */

var Container = require('../../bootstrap.js');
var transformer = Container.TriTransformer;
var year = process.argv[2];
var fs = require('fs');

function transformYear(year){
  var dirty = require(__dirname + "/../lib/json/TRI_" + year + "_US.json");
  var output = __dirname + "/../lib/json/CLEANED_TRI_" + year + "_US.json"

  console.log(year + " loaded...");

  var clean = transformer.List( dirty );
  console.log(year + " transformed...");

//*/
  var length = clean.length;
  var data = "[";
  fs.appendFileSync(output, data);

  var appendObject = function(obj, index){

    if(!obj instanceof Object){
      throw new TypeError("'obj' is not an object!");
    }

    data = JSON.stringify(obj);
    fs.appendFileSync(output, data);
  }

  // length = 50000;
  for(var i = 0; i < length; i++){
    appendObject(clean[i], i);

    if(i < length - 1){
      fs.appendFileSync(output, ",");
    }

    console.log(i + 1 + " of " + length);
  }

  data = "]";
  fs.appendFileSync(output, data);
  console.log(year + " done!");
//*/


/*/
  var data = JSON.stringify(clean);

  fs.writeFileSync(output, data);

  console.log(year + " saved!");
  delete dirty;
  delete clean;
  delete data;
//*/
}

transformYear(year);
