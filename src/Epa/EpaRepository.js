var Repository = require(__dirname + "/../Core/Repositories/Repository");

function EpaRepository(client, Transformer){

  var _index = 'epa-tri';
  var _type = 'records';
  var self = this;

  this._client = client;
  this._transformer = Transformer;

  this.save = function(release, callback){
    this._client.create({
      index: _index,
      type: _type,
      body: release
    }, function(err, response){
      if(! err){
        release._id = response._id;
      }
      callback(err, release);
    });
  }


  this.getFacilities = function(options, callback){
    this._client.search({
      index: _index,
      type: _type,
      q: options.filters,
      size: options.limit,
      from: options.offset
    }, function(err, response){
      if(!err){
        options.total = response.hits.total;
        self._setMeta(options);
        var data = response.hits.hits.map(function(hit){
          return hit._source.facility;
        });
      }
      callback(err, data);
    });
  }


  this.findFacilityById = function(facility_id, callback){
    this.getFacilities({
      filters: 'facility.id:' + facility_id
    }, function(err, data){
      if(! err){
        if(data.length == 0){
          err = new Error("Not Found!");
          data = null;
        }else{
          data = data[0];
        }
      }
      callback(err, data);
    });
  }


  this.getReleases = function(options, callback){
    this._client.search({
      index: _index,
      type: _type,
      q: options.filters,
      size: options.limit,
      from: options.offset
    }, function(err, response){
      if(! err){
        options.total = response.hits.total;
        self._setMeta(options);
        var data = response.hits.hits.map(function(hit){
          return hit._source;
        });
      }
      callback(err, data);
    });
  }


  this.getReleaseDocumentById = function(document_id, callback){
    this.getReleases({
      filters: 'documentControlNumber:' + document_id
    }, function(err, data){
      if(! err){
        if(data.length == 0){
          err = new Error("Not Found!");
          data = null;
        }else{
          data = data[0];
        }
      }
      callback(err, data);
    });
  }

  var _createQuery = function(groupBy, oper, fields, filters){
    var obj = {};

    // If summing
    if(oper == 'sum' || oper == 'avg'){
      var aggs = {};
      fields.forEach(function(field){
        aggs[field] = {
          sum: {field: field}
        }
      });

      obj.aggregations = {
          "group": {
              "terms": {
                "field": groupBy,
                "size": 0
              },
              "aggs": aggs
          }
      };
    }

    // filter aggregations
    if(filters){
      obj.query = {
         "filtered": {
            "query": {
              "query_string": {
                "query": filters
               }
             }
         }
      }
    }

    return obj;
  }

  var _transformBuckets = function(buckets, groupBy, fields){
    return buckets.map(function(bucket){
      var obj = {};

      obj[groupBy] = bucket.key;

      if(groupBy == 'facility.address.state'){
        obj[groupBy] = bucket.key.toUpperCase();
      }

      fields.forEach(function(field){
        obj[field] = bucket[field].value;
      });

      return obj;
    });
  }


  this.getReport = function(options, callback){

    var fields = options.agg_fields.split(",");
    var body = _createQuery(options.groupBy, options.operation, fields, options.filters);

    this._client.search({
      index: _index,
      type: _type,
      size: 0,
      body: body
    }, function(err, response){
      if(!err){
        var data = _transformBuckets(response.aggregations.group.buckets, options.groupBy, fields);
        options.total = data.length;
        self._setMeta(options);
      }
      callback(err, data);
    });
  }

}

EpaRepository.prototype = new Repository;

EpaRepository.constructor = EpaRepository;

module.exports = EpaRepository;
