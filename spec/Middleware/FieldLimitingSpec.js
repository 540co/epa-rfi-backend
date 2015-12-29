var request = require('supertest');
var Container = require("../../src/bootstrap.js");
var app = Container.app;

xdescribe("Middleware/FieldLimitingSpec", function(){

  it("GET /tri/releases?fields=facility (field limiting)", function(done){
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


  it("GET /tri/releases/{doc_control_num}?fields=facility (field limiting)", function(done){
    request(app)
      .get('/tri/releases')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        var doc_control_num = res.body.data[0].documentControlNumber;
        request(app)
          .get("/tri/releases/" + doc_control_num + "?fields=facility")
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res){
            var release = res.body.data;
            expect(release.facility.hasOwnProperty('address')).toEqual(true);
            expect(release.hasOwnProperty('quantitiesEnteringEnvironment')).toEqual(false);
            done();
          });
      });
  });


  it("GET /tri/releases?fields=facility.address (nested field limiting)", function(done){
    request(app)
      .get('/tri/releases?fields=facility.address')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        var release = res.body.data[0];
        expect(release.facility.hasOwnProperty('address')).toEqual(true);
        expect(release.facility.address.hasOwnProperty('state')).toEqual(true);
        expect(release.facility.hasOwnProperty('id')).toEqual(false);
        expect(release.hasOwnProperty('quantitiesEnteringEnvironment')).toEqual(false);
        done();
      });
  });


  it("GET /tri/releases/1234?fields=errors.message (does not execute if http code > 299)", function(done){
    request(app)
      .get('/tri/releases/1234?fields=errors.message')
      .set('Accept', 'application/json')
      .expect(404)
      .end(function(err, res){
        expect(res.body.errors.hasOwnProperty('errors')).toEqual(true);
        done();
      });
  });
});
