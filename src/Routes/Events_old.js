module.exports = function(router, Responder, Repo){

  router.get('/events', function(req, res){
    var limit = req.query.limit || 25;
    var offset = req.query.offset || 0;

    var options = {
      limit: limit,
      offset: offset
    };

    if(req.query.after){
      options.after = parseInt(req.query.after);
    }

    if(req.query.before){
      options.before = parseInt(req.query.before);
    }

    ['op', 'path', 'value'].forEach(function(prop){
      if(req.query[prop]){
        options[prop] = req.query[prop];
      }
    });

    Repo.getEvents(options, function(error, response){
      Responder(res).setMeta(Repo.getMeta()).respondOk( response );
    });
  });


  router.get('/events/:type', function(req, res){
    var limit = req.query.limit || 25;
    var offset = req.query.offset || 0;

    var options = {
      resource: req.params.type,
      limit: limit,
      offset: offset
    };

    if(req.query.after){
      options.after = parseInt(req.query.after);
    }

    if(req.query.before){
      options.before = parseInt(req.query.before);
    }

    ['op', 'path', 'value'].forEach(function(prop){
      if(req.query[prop]){
        options[prop] = req.query[prop];
      }
    });

    Repo.getEvents(options, function(error, response){
      Responder(res).setMeta(Repo.getMeta()).respondOk( response );
    });
  });


  router.get('/events/:type/:id', function(req, res){
    Repo.getEventsFor(req.params.type, req.params.id, function(error, response){
      Responder(res).setMeta(Repo.getMeta()).respondOk( response );
    });
  });

  return router;
};
