var cors = require('../../src/Middleware/Cors.js');

describe('CorsSpec', function(){

  it('sets cors headers', function(){
    var req = {
      method: 'OPTIONS'
    };

    var res = {
      _headers: {},

      header: function(header, value){
        this._headers[header] = value;
      },

      send: function(status){
        expect(status).toEqual(200);
      }
    };

    var next = function(){};

    cors(req, res, next);

    expect(res._headers['Access-Control-Allow-Origin']).toEqual("*");
    expect(res._headers['Access-Control-Allow-Methods']).toEqual('GET,PUT,POST,DELETE,OPTIONS,PATCH');
    expect(res._headers['Access-Control-Allow-Headers']).toEqual('X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept');
  });

});
