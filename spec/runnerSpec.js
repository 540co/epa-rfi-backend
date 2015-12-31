//"**/*[sS]pec.js" changed to runnerSpec.js


describe("EPA RFI Backend", function(){

/*/
  var Recorder = require('./support/nock_recorder.js');

  beforeAll(function(){
    Recorder.beginRecordingTo("./test_recording.js");
  });

  afterAll(function(){
    Recorder.stop();
  });
//*/


//*/
  // src
  require('./bootstrapSpec.js');

  // Core
  require('./Core/Container/ContainerSpec.js');
  require('./Core/Events/EventBusSpec.js');
  require('./Core/Events/SubscriberSpec.js');

  // Middleware
  require('./Middleware/CorsSpec.js');

  // Errors
  require('./Errors/HttpErrorSpec.js');

  // Epa
  require('./Epa/EpaRepositorySpec.js');

  // Routes
  require('./Routes/ReleasesSpec.js');
  require('./Routes/FacilitiesSpec.js');
  require('./Routes/ReportsSpec.js');
  require('./Routes/SwaggerSpec.js');
//*/
});
