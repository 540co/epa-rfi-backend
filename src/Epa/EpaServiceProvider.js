function EpaServiceProvider(){

  var _register = function(Container){
    _registerElasticClient(Container);
    _registerConverter(Container);
    _registerTransformer(Container);
    _registerRepository(Container);
    _registerDotObjectTransformer(Container);

    _registerRoutes(Container);
  }


  var _registerElasticClient = function(Container){
    Container.bindShared('client', function(container){
      var elasticsearch = require('elasticsearch');
      var config = container.resolve('config');
      return new elasticsearch.Client(config.db.elastic);
    });
  }


  var _registerConverter = function(Container){
    Container.bind('Converter', function(){
      var Converter = require('csvtojson').Converter;
      return new Converter({constructResult: true, flatKeys: true});
    });
  }


  var _registerTransformer = function(Container){
    Container.bind('TriTransformer', function(){
      var Transformer = require('model-transformer');
      return require('./TriTransformer')(Transformer);
    });
  }


  var _registerRepository = function(Container){
    Container.bind('EpaRepository', function(){
      var EpaRepository = require('./EpaRepository');
      var client = Container.client;
      var Transformer = Container.ElasticTransformer;
      return new EpaRepository(client, Transformer);
    });
  }


  var _registerDotObjectTransformer = function(Container){
    Container.bind('DotObjectTransformer', function(){
      var Transformer = require('model-transformer');
      return require('./DotObjectTransformer')(Transformer);
    });
  }



  var _registerRoutes = function(Container){
    var app = Container.app;
    var router = Container.router;//Container.express.Router();

    var Responder = Container.Responder;
    var Repo = Container.EpaRepository;
    var DotObjectTransformer = Container.DotObjectTransformer;

    // app.use(require('./routes.js')(router, Responder, Repo, DotObjectTransformer));
    var routes = require('./routes.js');
    routes(app, Responder, Repo, DotObjectTransformer);
  }
  

  return {
    register: _register
  }
}

module.exports = EpaServiceProvider;
