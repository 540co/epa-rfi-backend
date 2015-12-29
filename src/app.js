'use strict';
/*/
var Container = require('./bootstrap.js');
var app = Container.app;
var Responder = Container.Responder;
var bodyParser = require('body-parser');
var HttpError = require('./Errors/HttpError.js');


app.use( bodyParser.json() );


// Before Middleware
[
  __dirname + '/Middleware/LimitMaximum.js',
  __dirname + '/Middleware/Cors.js'
].forEach(function(path){
  app.use( require(path) );
});


// Load Service Providers
[
  __dirname + '/Epa/EpaServiceProvider.js'
].forEach(function(path){
  var provider = require(path);
  (new provider).register( Container );
});


// 404 catch
app.use(function(req, res, next){
  Responder(res).respondNotFound();
  next();
});


// 500 catch
app.use(function(err, req, res, next){
  var message = null;
  var errors = {};

  // if in debug mode
  if(Container.config.debug){
    message = err.message;
    errors = {
      message: err.toString(),
      stack: err.stack
    };
  }

  if(err instanceof HttpError){
    res.status(err.httpCode)
    res.json(err.message);
  }else{
    Responder(res).respondInternalError(message, errors);
  }

});
//*/

var Container = require('./bootstrap.js');

Container.app.listen(process.env.PORT || 3000);
