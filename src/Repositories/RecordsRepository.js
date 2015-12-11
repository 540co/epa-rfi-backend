var ResourceWasCreated = require('../Events/ResourceWasCreated.js');
var ResourceWasUpdated = require('../Events/ResourceWasUpdated.js');
var ResourceWasDeleted = require('../Events/ResourceWasDeleted.js');

function RecordsRepository(ElasticRepo, RecordTransformer, Dispatcher){

  var self = this;

  this.repo = ElasticRepo;
  this.transformer = RecordTransformer;
  this.dispatcher = Dispatcher;

  var _setResource = function(resource){
    self.repo.setIndex(resource);
    self.repo.setType('records');
    return self.repo;
  };

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

  this.getMeta = function(){
    return this.repo.getMeta();
  };

  this.findById = function(resource, id, callback){
    _setResource(resource).findById(id, _decorateCallback(callback));
  };

  this.get = function(resource, limit, offset, callback){
    _setResource(resource).get(limit, offset, _decorateCallback(callback));
  }

  this.save = function(resource, record, callback){
    _setResource(resource).save(record, function(error, response){

      if(! error){
        var data = self.transformer.Single(response);
        self.dispatcher.fire(new ResourceWasCreated(resource, data));
      }

      return callback(error, data);
    });
  }

  this.update = function(resource, record, callback){
    if(! record.hasOwnProperty('_id')){
      callback({
        error: "Record must have an '_id' property for an update."
      }, null);
    }

    // Get orginal
    _setResource(resource).findById(record._id, function(error, original){

      self.dispatcher.fire(new ResourceWasUpdated(resource, original, record));

      _setResource(resource).update(record, _decorateCallback(callback));
    });
  }

  this.delete = function(resource, record, callback){
    var event = new ResourceWasDeleted(resource, record);

    _setResource(resource).deleteById(record._id, function(error, response){
      if(! error){
        var data = self.transformer.Single(response);
        self.dispatcher.fire( event );
      }
      return callback(error, data);
    });
  }
}

module.exports = RecordsRepository;
