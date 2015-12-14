function Repository(){

  this._meta = {};

  this._setMeta = function(meta){
    this._meta = meta;
    return this;
  }

  this.getMeta = function(){
    return this._meta;
  }
}

module.exports = Repository;
