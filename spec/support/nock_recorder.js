var nock = require('nock');
var fs = require('fs');

var Recorder = {

  file: "./default_recording.js",

  beginRecordingTo: function(file){

    if(file){
      this.file = file;
    }

    var file = this.file;

    fs.appendFileSync(file, "module.exports = function(nock){ \n");

    var appendLogToFile = function(content) {
      fs.appendFileSync(file, content);
    }

    nock.recorder.rec({
      use_separator: false,
      logging: appendLogToFile,
    });

  },

  stop: function(){
    fs.appendFileSync(this.file, "\nreturn nock; \n};");
  }

}

module.exports = Recorder;
