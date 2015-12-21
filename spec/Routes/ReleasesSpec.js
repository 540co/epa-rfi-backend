var request = require('supertest');
var SchemaValidator = require('jsonschema-validator').Validator;

var Container = require("../../src/app.js");
var app = Container.app;
var swagger = require('../../src/Epa/lib/swagger/epa-swagger.json');


function Validator(validator){

  this.validator = validator;

  this.validate = function(instance, schema){
    var v = this.validator.validate(instance, schema);
    return ! v.errors.length;
  }
}


describe("ReleasesSpec", function(){

  var validator;

  beforeEach(function(){
    validator = new Validator(new SchemaValidator());
  });

  it("GET /tri/releases", function(done){
    var schema = swagger.definitions.Release;
    schema.definitions = {};
    schema.definitions.Facility = swagger.definitions.Facility;
    schema.definitions.NaicsCodes = swagger.definitions.NaicsCodes;

    request(app)
      .get('/tri/releases?limit=30')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        expect(res.body.data[0].hasOwnProperty('documentControlNumber')).toEqual(true);
        expect(res.body.meta.limit).toEqual(30);
        // expect(validator.validate(res.body.data[0], schema)).toEqual(true);
        done();
      });
  });


  it("GET /tri/releases/:doc_control_num", function(done){
    var doc_control_num = "1234";

    request(app)
      .get('/tri/releases?limit=30')
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


  it("GET /tri/releases?filters=facility.address.state:NC", function(done){
    request(app)
      .get('/tri/releases?filters=facility.address.state:NC')
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
        done();
      });
  });


  it("GET /tri/releases/{no such doc} returns 404", function(done){
    request(app)
      .get('/tri/releases/1234')
      .set('Accept', 'application/json')
      .expect(404)
      .end(function(err, res){
        expect(res.body.errors.message).toEqual("Not Found!");
        done();
      });
  });


  it("has enabled cors", function(done){
    request(app)
      .get('/tri/releases')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        expect(res.headers['access-control-allow-origin']).toEqual('*');
        done();
      });
  });

});
