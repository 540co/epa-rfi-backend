var Container = require('../bootstrap.js');

module.exports = function(req, res, next){
  var limit = Container.config.max_limit || 100;

  if(req.query.hasOwnProperty('limit')){
    req.query.limit = Math.min(req.query.limit, limit);
  }

  next();
}
