function EpaServiceProvider(){

  var _register = function(Container){
    _registerRoutes(Container);
  }

  var _registerRoutes = function(Container){
    var app = Container.app;

    var router = Container.express.Router();
    var Responder = Container.Responder;

    app.use(require('./routes.js')(router, Responder));
  }


  return {
    register: _register
  }
}

module.exports = EpaServiceProvider;
