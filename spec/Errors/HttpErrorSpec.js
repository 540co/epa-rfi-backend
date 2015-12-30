var HttpError = require('../../src/Errors/HttpError.js');

describe("HttpError", function(){

  it("defines an httpCode", function(){
    var error = new HttpError("Not Found!");

    expect(error.httpCode).toBeDefined();
    expect(error.name).toEqual('HttpError');
    expect(error.message).toEqual("Not Found!");
  });

});
