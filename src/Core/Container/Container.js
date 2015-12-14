var Container = module.exports = {

  _factories: {},

  _sharedInstances: {},

  _instances: {},

  _addProperty: function(prop){
    var self = this;
    this.__defineGetter__(prop, function(){
      return self.resolve(prop);
    });
  },

  register: function(name, fn){
    if(typeof fn !== 'function'){
      throw new TypeError("'fn' must be a function.");
    }

    this.unregister(name);

    this._factories[name] = fn;

    this._addProperty(name);

    return this;
  },

  unregister: function(name){
    delete this._factories[name];
    delete this._sharedInstances[name];
    delete this._instances[name];
  },

  bindShared: function(name, fn){
    if(typeof fn !== 'function'){
      throw new TypeError("'fn' must be a function.");
    }

    this.unregister(name);

    this._sharedInstances[name] = fn;

    this._addProperty(name);

    return this;
  },

  singleton: function(name, instance){

    this.unregister(name);

    this._instances[name] = instance;

    this._addProperty(name);

    return this;
  },

  create: function(name){
    return this._factories[name](this);
  },

  getInstance: function(name){
    return this._instances[name];
  },

  resolve: function(name){
    // Get resolved singleton
    if(this._instances.hasOwnProperty(name)){
      return this.getInstance(name);
    }

    // Create singleton instance
    if(this._sharedInstances.hasOwnProperty(name)){
      var instance = this._sharedInstances[name](this);
      this.singleton(name, instance);
      return instance;
    }

    // Get factory and create
    if(this._factories.hasOwnProperty(name)){
      return this.create(name);
    }

    throw new Error("No service registered: '" + name + "'");
  }

}
