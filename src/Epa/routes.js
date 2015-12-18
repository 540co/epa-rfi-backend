module.exports = function(router, Responder, Repo, DotObjectTransformer){

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
      limit: parseInt(req.query.limit) || 25,
      offset: parseInt(req.query.offset) || 0
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
    var filters = "facility.id:" + req.params.facility_id;

    if(req.query.filters){
      filters += "AND " + req.query.filters;
    }

    var options = {
      filters: filters,
      limit: parseInt(req.query.limit) || 25,
      offset: parseInt(req.query.offset) || 0
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
      limit: parseInt(req.query.limit) || 25,
      offset: parseInt(req.query.offset) || 0
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
  router.use('/tri/reports*', function(req, res, next){
    var mandatory = ['groupBy', 'operation', 'agg_fields'];

    for(var x in mandatory){
      if(! req.query.hasOwnProperty(mandatory[x])){
        Responder(res).respondBadRequest("Report requires the following query parameters: " + mandatory.join(", "));
        break;
      }
    }

    next();
  });


  router.get('/tri/reports', function(req, res){
    var options = {
      groupBy: req.query.groupBy,
      operation: req.query.operation,
      agg_fields: req.query.agg_fields,
      filters: req.query.filters
    }

    Repo.getReport(options, function(err, data){
      if(err){
        Responder(res).respondNotFound();
      }else{
        data = DotObjectTransformer.List(data);
        Responder(res).setMeta(Repo.getMeta()).respondOk(data);
      }
    });
  });


  router.get('/tri/reports/clean-air', function(req, res){
    var filters = "chemical.isCleanAirActChemical:true";

    if(req.query.filters){
      filters += "AND " + req.query.filters;
    }

    var options = {
      groupBy: req.query.groupBy,
      operation: req.query.operation,
      agg_fields: req.query.agg_fields,
      filters: filters
    }

    Repo.getReport(options, function(err, data){
      if(err){
        Responder(res).respondNotFound();
      }else{
        data = DotObjectTransformer.List(data);
        Responder(res).setMeta(Repo.getMeta()).respondOk(data);
      }
    });

  });

  return router;
}
