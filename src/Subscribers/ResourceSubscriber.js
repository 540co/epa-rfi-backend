var Subscriber = require('../Core/Events/Subscriber.js');
var Patch = require('../Models/Patch.js');

function ResourceSubscriber(PatchRepository, JsonPatcher){

  var _repo = PatchRepository;
  var _jsonPatcher = JsonPatcher;


  this.whenResourceWasCreated = function(event){
    // clean record
    var id = event.record._id;
    delete event.record._id;

    // get patches
    var up = _jsonPatcher.getPatches({}, event.record);
    var down = _jsonPatcher.getPatches(event.record, {});

    // Add id back
    event.record._id = id;

    //save
    var model = new Patch('create', event.resource, id, up, down);

    _repo.save( model, function(e, res){
      if(e){
        throw e;
      }
    });
  }


  this.whenResourceWasUpdated = function(event){
    var id = event.record._id;
    var oldR = event.original;
    var newR = event.record;

    // Remove id
    [oldR, newR].forEach(function(obj){
      delete obj._id;
    });

    var up = _jsonPatcher.getPatches(oldR, newR);
    var down = _jsonPatcher.getPatches(newR, oldR);

    // add id back
    newR._id = id;

    var model = new Patch('update', event.resource, id, up, down);

    _repo.save( model, function(e, res){
      if(e){
        throw e;
      }
    });
  }


  this.whenResourceWasDeleted = function(event){

    var id = event.record._id;
    delete event.record._id;

    var up = _jsonPatcher.getPatches(event.record, {});
    var down = _jsonPatcher.getPatches({}, event.record);

    var model = new Patch('delete', event.resource, id, up, down);

    _repo.save( model, function(e, res){
      if(e){
        throw e;
      }
    });
  }


  this.whenEntireResourceWasDeleted = function(event){
    var resource = event.resource;

    _repo.deleteByResource(resource, function(e, res){
      if(e){
        throw e;
      }
    });
  }

}


ResourceSubscriber.prototype = new Subscriber();

ResourceSubscriber.constructor = ResourceSubscriber;

module.exports = ResourceSubscriber;
