function ElasticRepository(client, ElasticTransformer){

  this._client = client;
  this._elasticTransformer = ElasticTransformer;

  var _index = null;
  var _type = null;
  var _meta = {};


  this.setIndex = function(index){
    _index = index;
    return this;
  };


  this.setType = function(type){
    _type = type;
    return this;
  };


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


  this.findById = function(id, callback){
    this._client.get({
      index: _index,
      type: _type,
      id: id
    }, function(error, response){
      if(! error){
        _setMeta(1, 1, 0);
        var data = ElasticTransformer.Single(response);
      }
      callback(error, data);
    });
  };


  this.get = function(limit, offset, callback){
    this._client.search({
      index: _index,
      type: _type,
      size: limit,
      from: offset
    }, function(error, response){
      if(! error){
        _setMeta(response.hits.total, limit, offset);
        var data = ElasticTransformer.List(response.hits.hits);
      }
      callback(error, data);
    });
  };

  this.query = function(q, body, limit, offset, callback){
    var options = {
      index: _index,
      type: _type,
      size: limit,
      from: offset
    };

    if(q){
      options.q = q;
    }

    if(body){
      options.body = body;
    }

    this._client.search(options, function(error, response){
      if(! error){
        _setMeta(response.hits.total, limit, offset);
        var data = ElasticTransformer.List(response.hits.hits);
      }
      callback(error, data);
    });
  }


  this.save = function(record, callback){
    var options = {
      index: _index,
      type: _type,
      body: record
    };

    // Is id present
    if(record.hasOwnProperty('_id')){
      options.id = record._id;
    }

    this._client.create(options, function(error, response){
      if(! error){
        _meta = {};
        record._id = response._id; // Is this smart?
        var data = record;
      }

      callback(error, data);
    });
  };


  this.update = function(record, callback){
    if(! record.hasOwnProperty('_id')){
      callback({
        error: "Record must have an '_id' property for an update."
      }, null);
    }

    var _id = record._id;

    // unset record._id;
    delete record._id;

    this._client.update({
      index: _index,
      type: _type,
      id: _id,
      body: {
        doc: record
      }
    }, function(error, response){
      if(! error){
        _meta = {};
        record._id = _id; // Is this smart?
        var data = record;
      }
      callback(error, data);
    });
  };

  this.delete = function(record, callback){
    if(! record.hasOwnProperty('_id')){
      callback({
        statusCode: 422,
        displayName: "Unprocessable Entity",
        message: "Record must have an '_id' property for an update."
      }, null);
    }

    this._client.delete({
      index: _index,
      type: _type,
      id: record._id,
    }, function(error, response){
      if(! error){
        _meta = {};
        var data = {
          success: true
        };
      }
      callback(error, data);
    });
  }


  this.deleteResource = function(resource, callback){
    this._client.delete({
      index: _index,
      type: _type
    }, callback);
  }


}

module.exports = ElasticRepository;
