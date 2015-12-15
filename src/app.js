var Container = require('./bootstrap.js');
var app = Container.app;
var express = Container.express;
var Responder = Container.Responder;
var bodyParser = require('body-parser');
var swaggerUi = require('swaggerize-ui');
var csv = require('csv-to-json');
var HttpError = require('./Errors/HttpError.js');

//*
app.use(function(req, res, next){
  // validate json
  next();
});
//*/

app.use( bodyParser.json() );



// Routes
var router = express.Router();
var schemaRepo = Container.make('SchemasRepository');
var resourceRepo = Container.make('ResourcesRepository');
var patchRepo = Container.make('PatchRepository');


app.use(require('./Routes/Schemas.js')(router, Responder, schemaRepo));
app.use(require('./Routes/Resources.js')(router, Responder, resourceRepo));
app.use(require('./Routes/Events.js')(router, Responder, patchRepo));
app.use(require('./Routes/Versions.js')(router, Responder, patchRepo));
app.use(require('./Routes/Swagger.js')(router, swaggerUi));


// 404 catch
app.use(function(req, res, next){
    Responder(res).respondNotFound();
  next();
});


// 500 catch
app.use(function(err, req, res, next){
  var message = null;
  var errors = {};

  // if in debug mode
  if(Container.config.debug){
    message = err.message;
    errors = {
      message: err.toString(),
      stack: err.stack
    };
  }

  if(err instanceof HttpError){
    res.status(err.httpCode)
    res.json(err.message);
  }else{
    Responder(res).respondInternalError(message, errors);
  }

});



app.listen(3000);

module.exports = Container;
