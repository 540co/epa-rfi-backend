var Container = require('../../../src/bootstrap.js');
var Dispatcher = Container.EventBus;
var Subscriber = Container.Subscriber;

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
