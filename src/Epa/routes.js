module.exports = function(app, Responder, Repo, DotObjectTransformer){

  function getFields(req){
    return req.query.fields ? req.query.fields.split(',') : [];
  }

  // SWAGGER
  app.get('/tri/swagger.json', function(req, res){
    var swagger = require('./lib/swagger/epa-swagger.json');
    res.json(swagger);
  });

  // FACILITIES
  app.get('/tri/facilities', function(req, res){
    var options = {
      filters: req.query.filters,
      limit: parseInt(req.query.limit) || 25,
      offset: parseInt(req.query.offset) || 0,
      fields: getFields(req)
    };

    Repo.getFacilities(options, function(err, data){
      if(err){
        Responder(res).respondBadRequest();
      }else{
        Responder(res).setMeta(Repo.getMeta()).respondOk(data);
      }
    });
  });


  app.get('/tri/facilities/:facility_id', function(req, res){
    var options = {
      fields: getFields(req)
    };

    Repo.findFacilityById(req.params.facility_id, options, function(err, data){
      if(err){
        Responder(res).respondNotFound();
      }else{
        Responder(res).setMeta(Repo.getMeta()).respondOk(data);
      }
    });
  });


  app.get('/tri/facilities/:facility_id/releases', function(req, res){
    var filters = "facility.id:" + req.params.facility_id;

    if(req.query.filters){
      filters += " AND " + req.query.filters;
    }

    var options = {
      filters: filters,
      limit: parseInt(req.query.limit) || 25,
      offset: parseInt(req.query.offset) || 0,
      fields: getFields(req)
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
  app.get('/tri/releases', function(req, res, next){
    var options = {
      filters: req.query.filters,
      limit: parseInt(req.query.limit) || 25,
      offset: parseInt(req.query.offset) || 0,
      fields: getFields(req)
    };

    Repo.getReleases(options, function(err, data){
      if(err){
        Responder(res).respondBadRequest();
      }else{
        Responder(res).setMeta(Repo.getMeta()).respondOk(data);
      }
    });
  });


  app.get('/tri/releases/:doc_control_num', function(req, res){
    var options = {
      fields: getFields(req)
    };

    Repo.getReleaseDocumentById(req.params.doc_control_num, options, function(err, data){
      if(err){
        Responder(res).respondNotFound();
      }else{
        Responder(res).setMeta(Repo.getMeta()).respondOk(data);
      }
    });
  });


  // REPORTS
  app.use('/tri/reports*', function(req, res, next){
    var mandatory = ['groupBy', 'operation', 'agg_fields'];

    for(var x in mandatory){
      if(! req.query.hasOwnProperty(mandatory[x]) || req.query[mandatory[x]] == ''){
        Responder(res).respondBadRequest("Report requires the following query parameters: " + mandatory.join(", "));
        return;
      }
    }

    next();
  });


  app.get('/tri/reports', function(req, res){
    var options = {
      groupBy: req.query.groupBy,
      operation: req.query.operation,
      agg_fields: req.query.agg_fields,
      filters: req.query.filters,
      limit: parseInt(req.query.limit) || 25,
      offset: parseInt(req.query.offset) || 0
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


  app.get('/tri/reports/clean-air', function(req, res){
    var filters = "chemical.isCleanAirActChemical:true";

    if(req.query.filters){
      filters += " AND " + req.query.filters;
    }

    var options = {
      groupBy: req.query.groupBy,
      operation: req.query.operation,
      agg_fields: req.query.agg_fields,
      filters: filters,
      limit: parseInt(req.query.limit) || 25,
      offset: parseInt(req.query.offset) || 0
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

  return app;
}
