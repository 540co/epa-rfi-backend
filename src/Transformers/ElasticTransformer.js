module.exports = function(Transformer){

  var ElasticTransformer = new Transformer(function(model){
    var obj = model._source;

    obj._id = model._id;

    return obj;
  });

  return ElasticTransformer;
}
