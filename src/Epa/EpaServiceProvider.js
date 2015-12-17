function EpaServiceProvider(){

  var _register = function(Container){
    _registerConverter(Container);
    _registerTransformer(Container);
    _registerRepository(Container);
    _registerRoutes(Container);
  }


  var _registerRoutes = function(Container){
    var app = Container.app;

    var router = Container.express.Router();
    var Responder = Container.Responder;
    var Repo = Container.EpaRepository;

    app.use(require('./routes.js')(router, Responder, Repo));
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


  return {
    register: _register
  }
}

module.exports = EpaServiceProvider;
