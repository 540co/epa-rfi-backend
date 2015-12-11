var Container = require('./Core/Container/Container.js');

Container.singleton('config', require('../config'));

Container.register('Responder', function(){
  return require('express-response-facade');
});

Container.bindShared('elasticsearch', function(container){
  var elasticsearch = require('elasticsearch');
  var config = container.resolve('config');
  return new elasticsearch.Client(config.db.elastic);
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

Container.bindShared('RecordsRepository', function(container){
  var RecordsRepository = require('./Repositories/RecordsRepository');
  var ElasticRepository = container.resolve('ElasticRepository');
  var RecordsTransformer = container.resolve('RecordsTransformer');
  var Dispatcher = container.resolve('Dispatcher');
  return new RecordsRepository(ElasticRepository, RecordsTransformer, Dispatcher);
});

// Listeners
Container.bindShared('ResourceSubscriber', function(container){
  var ResourceSubscriber = require('./Subscribers/ResourceSubscriber.js');
  var patchRepo = container.resolve('PatchRepository');
  var JsonPatcher = container.resolve('JsonPatcher');
  return new ResourceSubscriber(patchRepo, JsonPatcher);
});


// Register listeners
var Dispatcher = Container.resolve('Dispatcher');
var resourceSubscriber = Container.resolve('ResourceSubscriber');

Dispatcher.subscribe('ResourceWasCreated', resourceSubscriber);
Dispatcher.subscribe('ResourceWasUpdated', resourceSubscriber);
Dispatcher.subscribe('ResourceWasDeleted', resourceSubscriber);

module.exports = Container;
