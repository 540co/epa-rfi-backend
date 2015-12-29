var request = require('supertest');
var Container = require("../../src/bootstrap.js");
var app = Container.app;


describe("ReportsSpec", function(){

  it("GET /tri/reports with parameters", function(done){
    request(app)
      .get('/tri/reports?limit=3&groupBy=facility.address.state&operation=sum&agg_fields=quantitiesEnteringEnvironment.fugitiveAir,quantitiesEnteringEnvironment.stackAir')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        var reports = res.body.data;
        // expect(reports.length).toEqual(3);
        expect(reports[0].facility.address.hasOwnProperty('state')).toEqual(true);
        expect(reports[0].quantitiesEnteringEnvironment.hasOwnProperty('fugitiveAir')).toEqual(true);
        expect(reports[0].quantitiesEnteringEnvironment.hasOwnProperty('stackAir')).toEqual(true);
        done();
      });
  });


  it("GET /tri/reports/clean-air with parameters", function(done){
    request(app)
      .get('/tri/reports/clean-air?limit=3&groupBy=facility.address.state&operation=sum&agg_fields=quantitiesEnteringEnvironment.fugitiveAir,quantitiesEnteringEnvironment.stackAir')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        var reports = res.body.data;
        // expect(reports.length).toEqual(3);
        expect(reports[0].facility.address.hasOwnProperty('state')).toEqual(true);
        expect(reports[0].quantitiesEnteringEnvironment.hasOwnProperty('fugitiveAir')).toEqual(true);
        expect(reports[0].quantitiesEnteringEnvironment.hasOwnProperty('stackAir')).toEqual(true);
        done();
      });
  });


  it("GET /tri/reports with NO parameters", function(done){
    request(app)
      .get('/tri/reports')
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err, res){
        expect(res.body.errors.message).toEqual("Report requires the following query parameters: groupBy, operation, agg_fields");
        done();
      });
  });


  it("GET /tri/reports with NULL parameters (caused a crash)", function(done){
    request(app)
      .get('/tri/reports?groupBy=&operation=sum&agg_fields=fugitiveAir&filters=year%3A1987')
      .set('Accept', 'application/json')
      .expect(400)
      .end(function(err, res){
        expect(res.body.errors.message).toEqual("Report requires the following query parameters: groupBy, operation, agg_fields");
        done();
      });
  });

});
