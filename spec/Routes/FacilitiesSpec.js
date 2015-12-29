//*
var request = require('supertest');
var Container = require("../../src/bootstrap.js");
var app = Container.app;


describe("FacilitiesSpec", function(){

  var originalTimeout;

  beforeEach(function() {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;
  });

  it("GET /tri/facilities", function(done){
    request(app)
      .get('/tri/facilities?limit=30')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        var facility = res.body.data[0];
        expect(facility.hasOwnProperty('id')).toEqual(true);
        expect(facility.hasOwnProperty('address')).toEqual(true);
        expect(res.body.meta.limit).toEqual(30);
        done();
      });
  });


  it("GET /tri/facilities/:facility_id", function(done){
    request(app)
      .get('/tri/facilities?limit=1')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        var facility = res.body.data[0];
        request(app)
          .get('/tri/facilities/' + facility.id)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res){
            expect(res.body.data.id).toEqual(facility.id);
            done();
          });
      });
  });


  it("GET /tri/facilities/:facility_id/releases", function(done){
    request(app)
      .get('/tri/facilities?limit=1')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        var facility = res.body.data[0];
        request(app)
          .get('/tri/facilities/' + facility.id + "/releases")
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res){
            var releases = res.body.data;
            expect(releases[0].facility.id).toEqual(facility.id);
            releases.forEach(function(release){
              expect( release.hasOwnProperty('documentControlNumber') ).toEqual(true);
            });
            done();
          });
      });
  });


  it("GET /tri/facilities?filters=facility.address.state:NC", function(done){
    request(app)
      .get('/tri/facilities?filters=facility.address.state:NC')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        var facilities = res.body.data;
        facilities.forEach(function(facility){
          expect(facility.address.state).toEqual('NC');
        });
        done();
      });
  });


  it("GET /tri/facilities/{no such facility} returns 404", function(done){
    request(app)
      .get('/tri/facilities/1234')
      .set('Accept', 'application/json')
      .expect(404)
      .end(function(err, res){
        expect(res.body.errors.message).toEqual("Not Found!");
        done();
      });
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

});
//*/
