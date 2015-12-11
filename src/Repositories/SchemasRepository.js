function SchemasRepository(client){

  this._client = client;

  var _capitalizeFirstLetter = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  var _removePrivateProperties = function(obj){
    for(var prop in obj){
      if(_isPrivate(prop)){
        delete obj[prop];
      }
    }

    return obj;
  }

  var _isPrivate = function(property){
    var regex = new RegExp('^_');
    return regex.exec(property);
  }

  this.getMapping = function(resource, callback){
    this._client.indices.getMapping({
      index: resource
    }, function(error, response){
      if(! error){
        var props = response[resource].mappings.records.properties;

        props = _removePrivateProperties(props);

        var schema = {
          $schema: 'http://json-schema.org/draft-04/schema#',
          id: '/schemas/' + resource + '.json',
          title: _capitalizeFirstLetter(resource) + " Schema",
          properties: props
        }
        var data = schema;
      }
      callback(error, data);
    });
  }


  this.getAllSchemas = function(callback){
    this._client.indices.getMapping({}, function(error, response){
      if(! error){
        var data = [];
        for(var prop in response){
          data.push({
            id: "/schemas/" + prop + ".json",
            title: _capitalizeFirstLetter(prop) + " Schema"
          })
        }
      }
      callback(error, data);
    });
  }

}

module.exports = SchemasRepository;
