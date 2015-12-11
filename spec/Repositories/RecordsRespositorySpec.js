
var config = require('../../config');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client(config.db.elastic);
var Dispatcher = require('../../src/Core/Events/EventBus.js');
var Transformer = require('model-transformer');
var ElasticTransformer = require('../../src/Transformers/ElasticTransformer')(Transformer);
var RecordsTransformer = require('../../src/Transformers/RecordsTransformer')(Transformer);
var JsonPatcher = require('../../src/Services/JsonPatcher')(require('fast-json-patch'));
var ElasticRepository = require('../../src/Repositories/ElasticRepository');
var elasticRepo = new ElasticRepository(client, ElasticTransformer);
var RecordsRepository = require('../../src/Repositories/RecordsRepository');

var repo = new RecordsRepository(elasticRepo, RecordsTransformer, JsonPatcher, Dispatcher);

describe("RescordsRespository", function(){

  var person = {
    first: "James",
    last: "Bullard",
    age: '38'
  };

//*
  beforeEach(function(done){
    repo.deleteResource('people', function(error, response){
      done();
    });
  });

  it("saves an object", function(done){
    repo.save('people', person, function(error, response){
      expect( response.hasOwnProperty('_id') ).toEqual( true );
      // Retrieve it back
      repo.findById('people', response._id, function(error, obj){
        expect( obj ).toEqual( response );
        done();
      });
    });
  });

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
