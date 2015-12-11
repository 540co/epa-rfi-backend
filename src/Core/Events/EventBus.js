var EventBus = {

  _subscribers: {},

  _listeners: {},

  listen: function(event, fn){

    // init event array if none
    if(! this._listeners.hasOwnProperty(event)){
      this._listeners[event] = [];
    }

    this._listeners[event].push(fn);

    return this;
  },

  subscribe: function(event, handler){

    // init event array if none
    if(! this._subscribers.hasOwnProperty(event)){
      this._subscribers[event] = [];
    }

    this._subscribers[event].push(handler);

    return this;
  },

  fire: function(event){

    var eventName = this._getEventClassName(event);

    if(this._subscribers.hasOwnProperty(eventName)){
      this._subscribers[eventName].forEach(function(subscriber){
        subscriber.handle( event );
      });
    }

    if(this._listeners.hasOwnProperty(eventName)){
      this._listeners[eventName].forEach(function(fn){
        fn( event );
      });
    }

    return this;
  },

  _getEventClassName: function(obj){
    return obj.constructor.name;
  }
};

module.exports = EventBus;
