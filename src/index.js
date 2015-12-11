var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var swaggerUi = require('swaggerize-ui');
var Container = require('./bootstrap.js');


//*
app.use(function(req, res, next){
  // validate json
  next();
});
//*/

app.use( bodyParser.json() );


/*
app.use('/api-docs', function (req, res) {
  res.json(require('./Swagger/swagger'));
});

app.use('/docs', swaggerUi({
  docs: '/api-docs' // from the express route above.
}));
//*/

// Routes
var router = express.Router();
var Responder = Container.resolve('Responder');
// var schemaRepo = Container.resolve('SchemasRepository');
var recordRepo = Container.resolve('RecordsRepository');
var patchRepo = Container.resolve('PatchRepository');
// app.use(require('./Routes/Schemas')(router, Responder, schemaRepo));
app.use(require('./Routes/Records.js')(router, Responder, recordRepo));
app.use(require('./Routes/Events.js')(router, Responder, patchRepo));
app.use(require('./Routes/Versions.js')(router, Responder, patchRepo));

app.get(function(err, req, res, next){
  Responder(res).respondNotFound("no found");
});

app.listen(3000);
