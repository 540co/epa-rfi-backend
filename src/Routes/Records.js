module.exports = function(router, Responder, Repo){

  var errorHandler = function(error, res){
    var code = error.statusCode || error.status;

    code = parseInt(code);

    switch(code){
      case 404:
        Responder(res).respondNotFound();
      break;
      case 422:
        Responder(res).respondFormValidation();
      break;
      default:
        Responder(res).respondInternalError();
    }
  }

  // Index
  router.get('/resources/:type', function (req, res) {
    var limit = req.query.limit || 25;
    var offset = req.query.offset || 0;

    Repo.get(req.params.type, limit, offset, function(error, response){
        if(! error){
          Responder(res).setMeta(Repo.getMeta()).respondOk(response);
        }else{
          errorHandler(error, res);
        }
    });
  });


  // Find By Id
  router.get('/resources/:type/:id', function (req, res) {
    Repo.findById(req.params.type, req.params.id, function(error, response){
        if(! error){
          Responder(res).setMeta(Repo.getMeta()).respondOk(response);
        }else{
          errorHandler(error, res);
        }
    });
  });


  // Create
  router.post('/resources/:type', function (req, res) {
    var record = req.body;

    Repo.save(req.params.type, record, function(error, response){
        if(! error){
          Responder(res).setMeta(Repo.getMeta()).respondCreated(response);
        }else{
          errorHandler(error, res);
        }
    });
  });


  // Update
  router.put('/resources/:type/:id', function (req, res) {
    var record = req.body;

    // set _id property if not set
    if(! record.hasOwnProperty('_id')){
      record._id = req.params.id;
    }

    if(record._id !== req.params.id){
      // throw new Error("ID parameters do not match.");
    }

    Repo.update(req.params.type, record, function(error, response){
        if(! error){
          Responder(res).setMeta(Repo.getMeta()).respondOk(response);
        }else{
          errorHandler(error, res);
        }
    });
  });


  // Delete
  router.delete('/resources/:type/:id', function (req, res) {
    Repo.deleteById(req.params.type, req.params.id, function(error, response){
        if(! error){
          Responder(res).setMeta(Repo.getMeta()).respondOk(response);
        }else{
          errorHandler(error, res);
        }
    });
  });

  // All Versions
  router.get('/resources/:type/:id/versions', function(req, res){
    Repo.getVersions(req.params.type, req.params.id, function(error, response){
      if(! error){
        Responder(res)
          .setMeta({
            total: response.length
          })
          .respondOk(response);
      }else{
        errorHandler(error, res);
      }
    });
  });


  // Specific Version
  router.get('/resources/:type/:id/versions/:version', function(req, res){
    Repo.findVersion(req.params.type, req.params.id, req.params.version, function(error, response){
      if(! error){
        Responder(res).respondOk(response);
      }else{
        errorHandler(error, res);
      }
    });
  });


  return router;
}
