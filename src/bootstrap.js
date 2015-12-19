var Container = require('./Core/Container/Container.js');

Container.instance('config', require('../config'));

Container.instance('Responder', require('express-response-facade'));

Container.bind('Subscriber', function(){
  return require('./Core/Events/Subscriber.js');
});


// Services
Container.bind('express', function(){
  return require('express');
});

// Container.bindShared('app', function(container){
//   return container.express();
// });
var app = Container.express();
Container.instance('app', app);

Container.instance('router', Container.express.Router());

Container.instance('EventBus', require('./Core/Events/EventBus.js'));

Container.instance('Dispatcher', Container.EventBus);

//Transformers
Container.bind('Transformer', function(){
  return require('model-transformer');
});


module.exports = Container;
