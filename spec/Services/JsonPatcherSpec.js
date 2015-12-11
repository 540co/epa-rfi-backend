var JsonPatcher = require('../../src/Services/JsonPatcher')(require('fast-json-patch'));

describe("JsonPatcher", function(){

  var obj1 = {
    one: 1,
    two: 2
  };

  var obj2 = {
    one: 1,
    two: 3,
    three: 3
  };

  var patches = [
    {op: 'replace', path: '/two', value: 3},
    {op: 'add', path: '/three', value: 3}
  ];

  it("generates patches", function(){
    expect( JsonPatcher.getPatches(obj1, obj2)).toEqual(patches);
  });

  it("patches json", function(){
    expect( JsonPatcher.patchJson(obj1, patches)).toEqual(obj2);
  });

  it("doesn't mutate original object during patch", function(){
    var newObj = JsonPatcher.patchJson(obj1, patches);
    expect( newObj ).toEqual( obj2 );
    expect(obj1).toEqual({
      one: 1,
      two: 2
    });
  });
});
