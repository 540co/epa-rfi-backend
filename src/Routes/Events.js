module.exports = function(router, Responder, repo){

  router.get('/events', function(req, res){
    var limit = req.query.limit || 25;
    var offset = req.query.offset || 0;

    var options = {
      limit: limit,
      offset: offset,
      q: req.query.q
    };

    repo.query(options, function(error, response){
      if(! error){
        Responder(res).setMeta(repo.getMeta()).respondOk(response);
      }
      else{
        Responder(res).respondBadRequest(error);
      }
    });
  });


  router.get('/events/:resource', function(req, res){
    var limit = req.query.limit || 25;
    var offset = req.query.offset || 0;
    var q = "resource:" + req.params.resource;

    if(req.query.q){
      q = q + " AND " + req.query.q;
    }

    var options = {
      limit: limit,
      offset: offset,
      q: q
    };

    repo.query(options, function(error, response){
      if(! error){
        Responder(res).setMeta(repo.getMeta()).respondOk(response);
      }
      else{
        Responder(res).respondBadRequest(error);
      }
    });
  });


  router.get('/events/:resource/:resource_id', function(req, res){
    var limit = req.query.limit || 25;
    var offset = req.query.offset || 0;
    var q = "resource:" + req.params.resource + " AND " + "resource_id:" + req.params.resource_id;

    if(req.query.q){
      q = q + " AND " + req.query.q;
    }

    var options = {
      limit: limit,
      offset: offset,
      q: q
    };

    repo.query(options, function(error, response){
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
