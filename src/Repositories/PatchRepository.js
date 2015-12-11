var Patch = require('../Models/Patch.js');

function PatchRepository(client, Transformer){

  var _index = 'events';
  var _type = 'patches';
  var _meta = {};
  var self = this;

  this._client = client;
  this._transformer = Transformer;


  var _setMeta = function(total, limit, offset){
    _meta = {
      limit: parseInt(limit),
      offset: parseInt(offset),
      total: parseInt(total)
    }
  };


  this.getMeta = function(){
    return _meta;
  };


  this.save = function(patch, callback){
    this._client.create({
      index: _index,
      type: _type,
      body: patch
    }, function(e, res){
      if(! e){
        _meta = {};
        patch._id = res._id;
      }
      callback(e, patch);
    });
  }

  this.query = function(options, callback){
    var limit = parseInt(options.limit) || 25;
    var offset = parseInt(options.offset) || 0;

    this._client.search({
      index: _index,
      type: _type,
      q: options.q,
      size: limit,
      from: offset
    }, function(e, res){
      if(! e){
        _meta = {limit: limit, offset: offset, total: res.hits.total};
        res = self._transformer.List(res.hits.hits);
      }
      callback(e, res);
    });
  }

  this.getVersions = function(resource, id, callback){
    var q = "resource:" + resource + " AND resource_id:" + id;
    this.query({q: q}, function(e, res){
      if(! e){
        //
      }
    });
  }
}

module.exports = PatchRepository;
