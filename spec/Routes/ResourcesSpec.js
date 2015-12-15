var Container = require('../../src/app.js');
var app = Container.app;
var request = require('supertest');
var repo = Container.ResourcesRepository;
var factory = Container.factory;


describe('Resource Routes', function(){

  var person = {};
/*/
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

//*/
//*/
  it('GET /resources/people', function(done){
    request(app)
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
          throw err;
        }
        done();
      });
  });


  it('POST /resource/people', function(done){
    request(app)
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
        throw err;
      }
      expect(res.body.data.firstName).toEqual('Aaron');
      person = res.body.data;
      done();
    });
  });


  it('GET /resources/people/:id', function(done){
    request(app)
      .get('/resources/people/' + person._id)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        expect(res.body.data._id == person._id).toEqual(true);
        done();
      });
  });


  it('PUT /resources/people/:id', function(done){
    person.age++;

    request(app)
      .put('/resources/people/' + person._id)
      .set('Accept', 'application/json')
      .send(person)
      .expect(200)
      .end(function(err, res){
        expect(res.body.data.age).toEqual(person.age);
        done();
      });
  });


  it('DELETE /resources/people/:id', function(done){
    request(app)
      .delete('/resources/people/' + person._id)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
        expect(res.body.data.success).toEqual(true);
        done();
      });
  });
//*/
/*/
  afterAll(function(done){
    repo.deleteResource('people', function(error, response){
      if(error){
        throw error;
      }
      done();
    });
  });
//*/

});
