module.exports = function(router, Responder, Repo){

  // SWAGGER
  router.get('/tri', function(req, res){
    res.redirect('/docs/?url=%2Ftri%2Fswagger.json');
  });

  router.get('/tri/swagger.json', function(req, res){
    var swagger = require('./lib/swagger/epa-swagger.json');
    res.json(swagger);
  });

  // FACILITIES
  router.get('/tri/facilities', function(req, res){
    var options = {
      filters: req.query.filters,
      limit: req.query.limit,
      offset: req.query.offset
    };

    Repo.getFacilities(options, function(err, data){
      if(err){
        Responder(res).respondBadRequest();
      }else{
        Responder(res).setMeta(Repo.getMeta()).respondOk(data);
      }
    });
  });


  router.get('/tri/facilities/:facility_id', function(req, res){
    Repo.findFacilityById(req.params.facility_id, function(err, data){
      if(err){
        Responder(res).respondNotFound();
      }else{
        Responder(res).setMeta(Repo.getMeta()).respondOk(data);
      }
    });
  });


  router.get('/tri/facilities/:facility_id/releases', function(req, res){
    var filters = "";

    if(req.query.filters){
      filters += req.query.filters;
    }

    filters += " AND facility.id:" + req.params.facility_id;

    var options = {
      filters: filters,
      limit: req.query.limit,
      offset: req.query.offset
    };

    Repo.getReleases(options, function(err, data){
      if(err){
        Responder(res).respondNotFound();
      }else{
        Responder(res).setMeta(Repo.getMeta()).respondOk(data);
      }
    });
  });

  // RELEASES
  router.get('/tri/releases', function(req, res){
    var options = {
      filters: req.query.filters,
      limit: req.query.limit,
      offset: req.query.offset
    };

    Repo.getReleases(options, function(err, data){
      if(err){
        Responder(res).respondBadRequest();
      }else{
        Responder(res).setMeta(Repo.getMeta()).respondOk(data);
      }
    });
  });


  router.get('/tri/releases/:doc_control_num', function(req, res){
    Repo.getReleaseDocumentById(req.params.doc_control_num, function(err, data){
      if(err){
        Responder(res).respondNotFound();
      }else{
        Responder(res).setMeta(Repo.getMeta()).respondOk(data);
      }
    });
  });

  // REPORTS
  router.get('/tri/reports', function(req, res){

  });


  return router;
}
