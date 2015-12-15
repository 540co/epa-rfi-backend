module.exports = function(router){

  router.get('/tri', function(req, res){
    res.redirect('/docs/?url=%2Ftri%2Fswagger.json');
  });

  router.get('/tri/swagger.json', function(req, res){
    var swagger = require('./lib/swagger/epa-swagger.json');
    res.json(swagger);
  });


  return router;
}
