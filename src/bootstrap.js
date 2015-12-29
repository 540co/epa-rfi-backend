var Container = require('./Core/Container/Container.js');

Container.instance('config', require('../config.js'));

Container.instance('Responder', require('express-response-facade'));

Container.bind('Subscriber', function(){
  return require('./Core/Events/Subscriber.js');
});


// Services
Container.bind('express', function(){
  return require('express');
});

Container.bindShared('app', function(Container){
  return Container.express();
});

Container.instance('router', Container.express.Router());

Container.instance('EventBus', require('./Core/Events/EventBus.js'));

Container.instance('Dispatcher', Container.EventBus);

//Transformers
Container.bind('Transformer', function(){
  return require('model-transformer');
});

// Configure app
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


module.exports = Container;
