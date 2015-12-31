var nock = require('nock');
var request = require('supertest');
var Container = require("../../src/bootstrap.js");
var app = Container.app;

describe("ReleasesSpec", function(){

  it("GET /tri/releases", function(done){
    request(app)
      .get('/tri/releases?limit=3')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        expect(res.body.data[0].documentControlNumber).toBeDefined();
        expect(res.body.meta.limit).toEqual(3);
        done();
      });
  });


  it("GET /tri/releases/:doc_control_num", function(done){
    request(app)
      .get('/tri/releases?limit=3')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        doc_control_num = res.body.data[0].documentControlNumber;
        request(app)
          .get('/tri/releases/' + doc_control_num)
          .set('Accept', 'application/json')
          .expect(200)
          .end(function(err, res){
            expect(res.body.data.documentControlNumber).toEqual(doc_control_num);
            done();
          });
      });
  });


  it("GET /tri/releases?filters=facility.address.state:NC&limit=2", function(done){
    request(app)
      .get('/tri/releases?filters=facility.address.state:NC&limit=2')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        res.body.data.forEach(function(release){
          expect(release.facility.address.state).toEqual('NC');
        });
        done();
      });
  });


  it("GET /tri/releases?limit=150 returns a max of 100", function(done){
    request(app)
      .get('/tri/releases?limit=150')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        expect(res.body.data.length).toEqual(100);
        expect(res.body.meta.limit).toEqual(100);
        res.body.data.forEach(function(release){
          expect(release.documentControlNumber).toBeDefined();
        });
        done();
      });
  });


  it("GET /tri/releases/{no such doc} returns 404", function(done){
    request(app)
      .get('/tri/releases/4321')
      .set('Accept', 'application/json')
      .expect(404)
      .end(function(err, res){
        expect(res.body.errors.message).toEqual("Not Found!");
        done();
      });
  });


  it("has enabled cors", function(done){
    request(app)
      .get('/tri/releases?limit=3')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        expect(res.headers['access-control-allow-origin']).toEqual('*');
        done();
      });
  });


});
