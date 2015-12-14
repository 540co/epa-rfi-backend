var Container = require('../../src/app.js');
var express = Container.express;
var request = require('supertest');


describe('Resource Routes', function(){

  var person = {};

  beforeAll(function(done){
    Container.ResourcesRepository.save('people', {
      firstName: 'Aaron',
      lastName: 'Bullard',
      age: 38
    }, function(err, res){
      person = res;
      done();
    });
  });

  it('GET /resources/people', function(done){
    request(express)
      .get('/resources/people')
      .set('Accept', 'application/json')
      .expect(200)
      .expect(function(res){
        expect(res.body.hasOwnProperty('data')).toEqual(true);
        expect(res.body.hasOwnProperty('meta')).toEqual(true);
        expect(res.body.data[0].hasOwnProperty('firstName')).toEqual(true);
        var limit = Math.min(res.body.meta.limit, res.body.meta.total);
        expect(res.body.data.length == limit).toEqual(true);
      })
      .end(function(err, res){
        if (err){
          console.log(err);
        }
        done();
      });
  });


  it('POST /resource/people', function(done){
    request(express)
    .post('/resources/people')
    .set('Accept', 'application/json')
    .send({
      firstName: 'Aaron',
      lastName: 'Bullard',
      age: 38
    })
    .expect(201)
    .end(function(err, res){
      if(err){
        console.log(err);
      }
      expect(res.body.data.firstName).toEqual('Aaron');
      person = res.body.data;
      Container.ResourcesRepository.delete('people', person, function(err, res){
        done();
      });
    });
  });



  it('GET /resources/people/:id', function(done){
    request(express)
      .get('/resources/people/' + person._id)
      .expect(200)
      .end(function(err, res){
        expect(res.body.data._id == person._id).toEqual(true);
        done();
      });
  });

  afterAll(function(done){
    Container.ResourcesRepository.delete('people', person, function(err, res){
      done();
    });
  });

});
