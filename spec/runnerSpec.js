//"**/*[sS]pec.js" changed to runnerSpec.js

describe("EPA RFI Backend", function(done){

/*/
  var nock = require('nock');
  var fs = require('fs');
  var file = './spec/support/nocks/Routes/FacilitiesSpecNock.js';

  beforeAll(function(){

    fs.appendFileSync(file, "module.exports = function(nock){ \n");

    var appendLogToFile = function(content) {
      fs.appendFileSync(file, content);
    }
    nock.recorder.rec({
      use_separator: false,
      logging: appendLogToFile,
    });

  });

  afterAll(function(){
    fs.appendFileSync(file, "\nreturn nock; \n};");
  });

//*/

  // src
  require('./bootstrapSpec.js');

  // Core
  require('./Core/Container/ContainerSpec.js');
  require('./Core/Events/EventBusSpec.js');
  require('./Core/Events/SubscriberSpec.js');

  // Middleware
  require('./Middleware/CorsSpec.js');
  require('./Middleware/FieldLimitingSpec.js');

  // Errors
  require('./Errors/HttpErrorSpec.js');

  // Epa
  require('./Epa/EpaRepositorySpec.js');

  // Routes
  require('./Routes/ReleasesSpec.js');
  require('./Routes/FacilitiesSpec.js');
  require('./Routes/ReportsSpec.js');
  require('./Routes/SwaggerSpec.js');

});
