var Container = require("../../src/app.js");
var repo = Container.EpaRepository;

describe("EpaRepository", function(){

  it("getFacilities", function(done){
    repo.getFacilities({filters:"facility.address.state:NC", limit: 25}, function(err, data){
      expect(data.length > 0).toEqual(true);
      expect(data.length).toEqual(25);
      data.forEach(function(facility){
        expect(facility.address.state).toEqual("NC");
      });
      done();
    });
  });


  it("getFacilities", function(done){
    repo.getFacilities({limit: 25}, function(err, data){
      expect(data.length).toEqual(25);
      done();
    });
  });


  it("getFacilities without duplicates", function(done){
    repo.getFacilities({
      filters:"facility.address.state:NC",
      limit: 100
    }, function(err, data){
      expect(data.length > 0).toEqual(true);
      var ids = data.map(function(facility){
        return facility.id;
      });

      ids = ids.sort();

      for(var i = 1; i < ids.length; i++){
        expect(ids[i] == ids[i-1]).toEqual(false);
      }
      done();
    });
  });

});
