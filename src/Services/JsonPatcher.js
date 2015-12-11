module.exports = function(patcher){

  var _getPatches = function(from, to){
    return patcher.compare(from, to);
  };

  var _patchJson = function(json, patches){
    var json = JSON.parse(JSON.stringify(json)); // clone object so original isn't mutated
    patcher.apply(json, patches);
    return json;
  };

  return {
    getPatches: _getPatches,
    patchJson: _patchJson
  };
}
