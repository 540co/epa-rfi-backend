var Container = require('./bootstrap.js');
var app = Container.app;
var Responder = Container.Responder;
var bodyParser = require('body-parser');
var HttpError = require('./Errors/HttpError.js');


app.use( bodyParser.json() );


// Before Middleware
[
  './Middleware/LimitMaximum.js',
  './Middleware/FieldLimiting.js'
].forEach(function(path){
  app.use( require(path) );
});


// Load Service Providers
Container.config.service_providers.forEach(function(path){
  var provider = require(path);
  (new provider).register( Container );
});


// After Middleware
[
  // './Middleware/FieldLimiting.js'
].forEach(function(path){
  app.use( require(path) );
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


app.listen(3000);

module.exports = Container;
