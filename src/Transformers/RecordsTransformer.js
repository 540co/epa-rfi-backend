module.exports = function(Transformer){

  var RecordsTransformer = new Transformer(function(model){
    delete model._migrations;
    return model;
  });

  return RecordsTransformer;
}
