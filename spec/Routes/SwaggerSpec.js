var request = require('supertest');
var Container = require('../../src/bootstrap.js');
var app = Container.app;

describe("Swagger", function(){

  it("GET /tri/swagger.json returns a swagger file", function(done){
    request(app)
      .get('/tri/swagger.json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        var swagger = res.body;
        expect(swagger.swagger).toBeDefined();
        expect(swagger.info.title).toEqual("EPA TRI Program");
        done();
      });
  });
});
