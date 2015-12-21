var interceptor = require('express-interceptor');

var FieldLimitingInterceptor = interceptor(function(req, res){
  return {
    // Only JSON responses will be intercepted
    isInterceptable: function(){
      var isJson = /application\/json/.test(res.get('Content-Type'));

      if(! isJson){
        return false;
      }

      // Was field limiting requested
      if(! req.query.fields){
        return false;
      }

      return true;
    },

    // Appends a paragraph at the end of the response body
    intercept: function(body, send) {
      var json = JSON.parse(body);

      if(! json.hasOwnProperty('data')){
        send(body);
      }

      var newBody = {};
      newBody.meta = json.meta;

      var fields = req.query.fields.split(',');

      // Data is array of objects?
      var isArray = json.data instanceof Array ? true : false;

      var transform = function(obj, fields){
        var newObj = {};

        fields.forEach(function(field){
          newObj[field] = obj[field];
        });

        return newObj;
      }

      if(isArray){
        newBody.data = [];

        json.data.forEach(function(obj){
          newBody.data.push( transform(obj, fields) );
        });
      }

      var string = JSON.stringify( newBody );

      send(string);
    }
  };
});

module.exports = FieldLimitingInterceptor;
