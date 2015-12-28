/* istanbul ignore next */

var HttpError = require('./HttpError.js');

function UnprocessableEntity(message){
  this.httpCode = 422;
}

UnprocessableEntity.prototype = new HttpError;

UnprocessableEntity.constructor = UnprocessableEntity;

module.exports = UnprocessableEntity;
