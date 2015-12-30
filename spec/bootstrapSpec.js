var request = require('supertest');
var Container = require('../src/bootstrap.js');
var app = Container.app;

describe("bootstrap.js", function(){

  it("defines a config object", function(){
    expect(Container.config).toBeDefined();
  });

  it("defines a Transformer", function(){
    expect(Container.Transformer).toBeDefined();
  });

  it("handles http errors", function(done){
    request(app)
      .get('/nosuchurl')
      .expect(404)
      .end(function(err, res){
        expect(res.body.errors.message).toEqual("Not Found!");
        done();
      });
  });

});
