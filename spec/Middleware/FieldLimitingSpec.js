var request = require('supertest');
var Container = require("../../src/app.js");
var app = Container.app;

fdescribe("Middleware/FieldLimitingSpec", function(){

  it("GET /tri/releases?fields=facility", function(done){
    request(app)
      .get('/tri/releases?fields=facility')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        var release = res.body.data[0];
        expect(release.facility.hasOwnProperty('address')).toEqual(true);
        expect(release.hasOwnProperty('quantitiesEnteringEnvironment')).toEqual(false);
        done();
      });
  });
});
