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

  return router;
}
