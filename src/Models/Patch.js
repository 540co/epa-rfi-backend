function Patch(event_type, resource, resource_id, up, down){

  var time = Date.now();

  return {
    resource_id: resource_id,
    resource: resource,
    event_type: event_type,
    time: time,
    up: up,
    down: down
  };
}

module.exports = Patch;
