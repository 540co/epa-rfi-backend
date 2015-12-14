var ResourceWasCreated = require('../Events/ResourceWasCreated.js');
var ResourceWasUpdated = require('../Events/ResourceWasUpdated.js');
var ResourceWasDeleted = require('../Events/ResourceWasDeleted.js');
var Repository = require('./Repository');

function ResourcesRepository(client, RecordTransformer, Dispatcher){

  var self = this;
  var _index = null;
  var _type = 'records';

  this._client = client;
  this.transformer = RecordTransformer;
  this.dispatcher = Dispatcher;

  var _getObject = function(response){
    var obj = response._source;
    obj._id = response._id;
    return obj;
  }

  var _getList = function(response){
    return response.hits.hits
  }

  var _decorateCallback = function(callback){
    return function(error, response){
      if(! error){
        var data = (response instanceof Array) ?
          self.transformer.List(response) :
          self.transformer.Single(response);
      }
      return callback(error, data);
    }
  }


  this.findById = function(resource, id, callback){
    this._client.get({
      index: resource,
      type: _type,
      id: id
    }, _decorateCallback(callback));
  };

  this.get = function(resource, limit, offset, callback){
    this._client.search({
      index: resource,
      type: _type,
      size: limit,
      from: offset
    }, function(error, response){
      if(! error){
        var list = response.hits.hits.map(function(obj){
          return _getObject(obj);
        });
      }
      return callback(error, list);
    });
  }

  this.save = function(resource, record, callback){
    var options = {
      index: resource,
      type: _type,
      body: record
    };

    // Is id present
    if(record.hasOwnProperty('_id')){
      options.id = record._id;
    }

    this._client.create(options, function(error, response){
      if(! error){
        self._meta = {};
        record._id = response._id; // Is this smart?
      }

      self.dispatcher.fire(new ResourceWasCreated(resource, record));

      callback(error, record);
    });
  }

  this.update = function(resource, record, callback){
    if(! record.hasOwnProperty('_id')){
      callback({
        error: "Record must have an '_id' property for an update."
      }, null);
    }

    var id = record._id;

    delete record._id;

    this.findById(resource, id, function(error, data){
      if(! error){
        self._client.update({
          index: resource,
          type: _type,
          id: id,
          body: {
            doc: record
          }
        }, function(err, response){
          if(! err){
            record._id = id;
            self.dispatcher.fire(new ResourceWasCreated(resource, record));
          }
          callback(err, record);
        });
      }
    });
  }

  this.delete = function(resource, record, callback){
    if(! record.hasOwnProperty('_id')){
      callback({
        error: "Record must have an '_id' property for delete."
      }, null);
    }

    var event = new ResourceWasDeleted(resource, record);

    this._client.delete({
      index: resource,
      type: _type,
      id: record._id
    }, function(error, response){
      if(! error){
        self.dispatcher.fire( event );
      }
      callback(error, {success: true});
    });
  }

  this.deleteResource = function(resource, callback){
    this._client.delete({
      index: resource,
      type: _type
    }, callback);
  }
}

ResourcesRepository.prototype = new Repository;

ResourcesRepository.constructor = ResourcesRepository;

module.exports = ResourcesRepository;
