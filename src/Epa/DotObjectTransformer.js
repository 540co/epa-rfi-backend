var dot = require('dot-object');

module.exports = function(Transformer){

  var DotObjectTransformer = new Transformer(function(model){
    return dot.object(model);
  });

  return DotObjectTransformer;
}
