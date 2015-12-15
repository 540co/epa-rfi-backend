var Container = require('../../../src/Core/Container/Container.js');

describe('ContainerSpec', function(){

  it('binds factories', function(){
    function Person(){}

    Container.bind('Person', function(){
      return new Person();
    });

    var person1 = Container.make('Person');
    var person2 = Container.make('Person');

    // returns object of person
    expect(person1.constructor.name).toEqual('Person');
    // returns different instance
    expect(person1 === person2).toEqual(false);
  });


  it('registers singleton instances', function(){
    function Person(name){
      this.name = name;
    }

    Container.instance('Person', new Person('Aaron'));

    var person = Container.resolve('Person');
    person.name = 'Bob';

    // returns same instance
    expect(Container.make('Person').name).toEqual('Bob');
  });


  it('shares factoried objects as singletons', function(){
    function Person(name){
      this.name = name;
    }

    Container.bindShared('Person', function(){
      return new Person('Aaron');
    });

    var person = Container.resolve('Person');
    person.name = 'Bob';

    // returns same instance
    expect(Container.resolve('Person').name).toEqual('Bob');
  });


  it('exposes resolve by properties', function(){
    function Person(){}

    Container.bind('Person', function(){
      return new Person();
    });

    expect( Container.Person instanceof Person ).toEqual(true);
  });


  it('unregisters bindings', function(){
      Container.bind('Obj', function(){
        return {
          a: 'a'
        };
      });

      expect( Container.Obj.a ).toEqual('a');

      // unregister
      Container.unbind('Obj');

      var isUnregistered = false;
      try{
        Container.Obj;
      }
      catch(e){
        isUnregistered = true;
      }
      expect( isUnregistered ).toEqual(true);
  });

});
