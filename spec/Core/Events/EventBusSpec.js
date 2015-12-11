var EventBus = require('../../../src/Core/Events/EventBus.js');

function ThingWasSavedEvent(param1, param2){
  this.param1 = param1;
  this.param2 = param2
};

describe('EventBus', function(){

  it('it calls listeners', function(){
    var listenerWasCalled = false;

    // Register listener
    EventBus.listen('ThingWasSavedEvent', function(event){
      expect(event.param1).toEqual('one');
      expect(event.param2).toEqual('two');
      listenerWasCalled = true;
    });

    var event = new ThingWasSavedEvent('one', 'two');

    EventBus.fire(event);
    expect(listenerWasCalled).toEqual(true);
  });


  it('it calls subscribers', function(){
    var subscriberWasCalled = false;

    var MySubscriber = function(){
      this.handle = function(event){
        expect(event.param1).toEqual('one');
        expect(event.param2).toEqual('two');
        subscriberWasCalled = true;
      }
    };

    EventBus.subscribe('ThingWasSavedEvent', new MySubscriber());

    var event = new ThingWasSavedEvent('one', 'two');

    EventBus.fire(event);

    expect(subscriberWasCalled).toEqual(true);
  });
});
