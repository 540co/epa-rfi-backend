var Subscriber = require('../../../src/Core/Events/Subscriber.js');
var Dispatcher = require('../../../src/Core/Events/EventBus.js');

describe('Subscriber', function(){

  it('can be extended', function(){
    var wasCalled = false;

    // Event
    function ObjectWasSaved(obj){
      this.obj = obj;
    }

    // Listener
    function MySubscriber(){
      this.whenObjectWasSaved = function(event){
        wasCalled = true;
      }
    }

    MySubscriber.prototype = new Subscriber();

    Dispatcher.subscribe('ObjectWasSaved', new MySubscriber);

    Dispatcher.fire(new ObjectWasSaved({}));

    expect(wasCalled).toEqual(true);
  });
});
