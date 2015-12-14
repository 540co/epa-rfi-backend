var Container = require('./Core/Container/Container.js');

Container.singleton('config', require('../config'));

Container.singleton('factory', require('./lib/factories/factories.js'));

Container.register('Responder', function(){
  return require('express-response-facade');
});


// Services
Container.singleton('Dispatcher', require('./Core/Events/EventBus.js'));

Container.register('JsonPatcher', function(){
  return require('./Services/JsonPatcher')(require('fast-json-patch'));
});

//Transformers
Container.register('ElasticTransformer', function(){
  var Transformer = require('model-transformer');
  return require('./Transformers/ElasticTransformer')(Transformer);
});

Container.register('RecordsTransformer', function(){
  var Transformer = require('model-transformer');
  return require('./Transformers/RecordsTransformer')(Transformer);
});

Container.register('EventTransformer', function(){
  var Transformer = require('model-transformer');
  return require('./Transformers/EventTransformer')(Transformer);
});


// Repos
Container.bindShared('client', function(container){
  var elasticsearch = require('elasticsearch');
  var config = container.resolve('config');
  return new elasticsearch.Client(config.db.elastic);
});

Container.bindShared('ElasticRepository', function(container){
  var ElasticRepository = require('./Repositories/ElasticRepository');
  var client = container.resolve('client');
  var transformer = container.resolve('ElasticTransformer');
  return new ElasticRepository(client, transformer);
});

Container.bindShared('PatchRepository', function(container){
  var PatchRepository = require('./Repositories/PatchRepository');
  var client = container.resolve('client');
  var transformer = container.resolve('ElasticTransformer');
  var JsonPatcher = container.resolve('JsonPatcher');
  return new PatchRepository(client, transformer, JsonPatcher);
});

Container.bindShared('ResourcesRepository', function(container){
  var ResourcesRepository = require('./Repositories/ResourcesRepository');
  var client = container.resolve('client');
  var RecordsTransformer = container.resolve('RecordsTransformer');
  var Dispatcher = container.resolve('Dispatcher');
  return new ResourcesRepository(client, RecordsTransformer, Dispatcher);
});

Container.bindShared('SchemasRepository', function(container){
    var SchemasRepository = require('./Repositories/SchemasRepository');
    var client = container.resolve('client');
    return new SchemasRepository(client);
});

// Listeners
Container.bindShared('ResourceSubscriber', function(container){
  var ResourceSubscriber = require('./Subscribers/ResourceSubscriber.js');
  var patchRepo = container.resolve('PatchRepository');
  var JsonPatcher = container.resolve('JsonPatcher');
  return new ResourceSubscriber(patchRepo, JsonPatcher);
});


// Register listeners
if(Container.config.capture_versions){
  var Dispatcher = Container.resolve('Dispatcher');
  var resourceSubscriber = Container.resolve('ResourceSubscriber');

  Dispatcher.subscribe('ResourceWasCreated', resourceSubscriber);
  Dispatcher.subscribe('ResourceWasUpdated', resourceSubscriber);
  Dispatcher.subscribe('ResourceWasDeleted', resourceSubscriber);
}

module.exports = Container;
