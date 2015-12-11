module.exports = function(router, Responder, repo){

  router.get('/resources/:resource/:resource_id/versions', function(req, res){
    var resource = req.params.resource;
    var resource_id = req.params.resource_id;
    var limit = req.query.limit || 25;
    var offset = req.query.offset || 0;

    var options = {
      limit: limit,
      offset: offset
    };

    repo.getVersions(resource, resource_id, function(error, response){
      if(! error){
        Responder(res).setMeta(repo.getMeta()).respondOk(response);
      }
      else{
        Responder(res).respondBadRequest(error);
      }
    });
  });

  return router;
}
