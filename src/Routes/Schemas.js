module.exports = function(router, Responder, Repo){

  // Index
  router.get('/schemas', function(req, res){
    Repo.getAllSchemas(function(error, response){
      if(! error){
        Responder(res).respondOk(response);
      }else{
        Responder(res).respondInternalError();
      }
    });
  });

  // Find a Schema
  router.get('/schemas/:type', function(req, res){
    var isJsonDoc = (req.params.type.search('.json') > -1);
    var resource = req.params.type.replace('.json', '');

    Repo.getMapping(resource, function(error, response){
      if(! error){
        if(isJsonDoc){
          res.json(response); // return just the object without data or meta indexes.
        }else{
          Responder(res).respondOk(response);
        }
      }else{
        Responder(res).respondNotFound();
      }
    });
  });

  return router;
}
