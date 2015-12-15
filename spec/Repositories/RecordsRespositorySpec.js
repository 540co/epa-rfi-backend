/*/
var Container = require('../../src/bootstrap.js');
var repo = Container.ResourcesRepository;
var factory = Container.factory;

describe("RecordsRespository", function(){

  describe("CRUD operations", function(){

    beforeAll(function(done){
      repo.deleteResource('people', function(error, response){
        var people = factory.times(20).make('Person');
        people.forEach(function(person, index){
          if(index < 19){
            repo.save('people', person, function(){});
          }else{
            repo.save('people', person, function(err, data){
              done();
            });
          }
        });
      });
    });

    var person = {};

    it('gets a list', function(done){
      repo.get('people', 15, 0, function(err, data){
        expect(data.length).toEqual(15);
        expect(data[0].hasOwnProperty('firstName')).toEqual(true);
        done();
      });
    });

    it('saves', function(done){
      person = {
        firstName: 'Aaron',
        lastName: 'Bullard',
        age: 38
      };

      repo.save('people', person, function(err, data){
        person = data;
        expect(data.firstName).toEqual('Aaron');
        done();
      });
    });

    it('finds by id', function(done){
      repo.findById('people', person._id, function(error, data){
        expect(person._id == data._id).toEqual(true);
        done();
      });
    });


    it('updates', function(done){
      person.firstName = 'Bob';
      repo.update('people', person, function(error, data){
        expect(data.firstName).toEqual('Bob');
        done();
      });
    });


    it('deletes', function(done){
      repo.delete('people', person, function(err, response){
        expect(response).toEqual({success: true});
        done();
      });
    });


    afterAll(function(done){
      repo.deleteResource('people', function(error, response){
        if(error){
          throw error;
        }
        done();
      });
    });

  }); // end CRUD
/*/

/*/
  it("saves versions", function(done){
    repo.save('people', person, function(e, record){
      record.age = '39';
      repo.update('people', record, function(e, record){
        record.middle = "Aaron";
        repo.update('people', record, function(e, record){
          // get versions
          repo.getVersions('people', record._id, function(e, versions){
            // remove _revised_at, don't know the time so can't test
            versions = versions.map(function(version){
              delete version._created_at;
              return version;
            });

            expect( versions.length ).toEqual( 3 );

            // Version 1
            expect( versions[0] ).toEqual({
              first: "James",
              last: "Bullard",
              age: '38',
              _id: record._id,
              _version: 1
            });

            // Version 2
            expect( versions[1] ).toEqual({
              first: "James",
              last: "Bullard",
              age: '39',
              _id: record._id,
              _version: 2
            });

            // Version 3
            expect( versions[2] ).toEqual({
              first: "James",
              middle: "Aaron",
              last: "Bullard",
              age: '39',
              _id: record._id,
              _version: 3
            });

            done();
          });
        });
      });
    });
  });


  it("fires ResourceWasCreated on save", function(done){
    var listenerWasCalled = false;

    Dispatcher.listen('ResourceWasCreated', function(event){
      expect(event.constructor.name).toEqual('ResourceWasCreated');
      listenerWasCalled = true;
    });

    repo.save('people', person, function(error, response){
      expect( listenerWasCalled ).toEqual( true );
      done();
    });
  });

  it("fires ResourceWasUpdated on update", function(done){
    var listenerWasCalled = false;

    Dispatcher.listen('ResourceWasUpdated', function(event){
      expect(event.constructor.name).toEqual('ResourceWasUpdated');
      listenerWasCalled = true;
    });

    repo.save('people', person, function(error, data){
      data.age = '39';
      repo.update('people', data, function(error, response){
        expect( listenerWasCalled ).toEqual( true );
        done();
      });
    });
  });



});
//*/
