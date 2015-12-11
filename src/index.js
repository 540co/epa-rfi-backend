var express = require('express');
var app = express();
var Container = require('./bootstrap.js');
var bodyParser = require('body-parser');
var swaggerUi = require('swaggerize-ui');


//*
app.use(function(req, res, next){
  // validate json
  next();
});
//*/

app.use( bodyParser.json() );

app.use('/api-docs', function (req, res) {
  res.json(require('./Swagger/swagger'));
});

app.use('/docs', swaggerUi({
  docs: '/api-docs' // from the express route above.
}));

// Routes
var router = express.Router();
var Responder = Container.resolve('Responder');
var schemaRepo = Container.resolve('SchemasRepository');
var resourceRepo = Container.resolve('ResourcesRepository');
var patchRepo = Container.resolve('PatchRepository');


app.use(require('./Routes/Schemas.js')(router, Responder, schemaRepo));
app.use(require('./Routes/Resources.js')(router, Responder, resourceRepo));
app.use(require('./Routes/Events.js')(router, Responder, patchRepo));
app.use(require('./Routes/Versions.js')(router, Responder, patchRepo));



// app.use(function(err, req, res, next){
//   if(err){
//     Responder(res).respondNotFound();
//   }
//   next();
// });



app.listen(3000);
