var UnprocessableEntityError = require('../Errors/UnprocessableEntityError.js');


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

    // If instance ID doesn't exist, create it TODO
    Repo.findById(req.params.type, req.params.id, function(error, data){
      if(! error){
        if(record._id !== req.params.id){
          throw new Error("ID parameters do not match.");
        }

        Repo.update(req.params.type, record, function(error, response){
            if(! error){
              Responder(res).setMeta(Repo.getMeta()).respondOk(response);
            }else{
              errorHandler(error, res);
            }
        });
      }
      else{
        // No such resource and id, so create one with this id
        Repo.save(req.params.type, record, function(error, new_record){
            if(! error){
              Responder(res).setMeta(Repo.getMeta()).respondCreated(new_record);
            }else{
              errorHandler(error, res);
            }
        });
      }
    });
  });


  // Delete
  router.delete('/resources/:type/:id', function (req, res) {
    Repo.findById(req.params.type, req.params.id, function(error, record){
      if(error){
        throw error;
      }else{
        Repo.delete(req.params.type, record, function(error, response){
            if(! error){
              Responder(res).setMeta(Repo.getMeta()).respondOk(response);
            }else{
              errorHandler(error, res);
            }
        });
      }
    });




  });

  return router;
}
