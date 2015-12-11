module.exports = function(Transformer){

  var EventTransformer = new Transformer(function(model){

      var event = {};

      try{
        event._resource = model._index;
        event._id = model._id;
        event.migrations = model._source._migrations.map(function(migration){
          delete migration.down;
          return migration;
        });
      }catch(e){
        event.error = "Unable to locate migration events.";
      }

      return event;
  });

  return EventTransformer;
}
