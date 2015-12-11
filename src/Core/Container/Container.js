var Container = module.exports = {

  _factories: {},

  _sharedInstances: {},

  _instances: {},

  register: function(name, fn){
    if(typeof fn !== 'function'){
      throw new TypeError("'fn' must be a function.");
    }

    this._factories[name] = fn;
    return this;
  },

  bindShared: function(name, fn){
    if(typeof fn !== 'function'){
      throw new TypeError("'fn' must be a function.");
    }

    this._sharedInstances[name] = fn;
    return this;
  },

  create: function(name){
    return this._factories[name](this);
  },

  singleton: function(name, instance){
    this._instances[name] = instance;
    return this;
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
