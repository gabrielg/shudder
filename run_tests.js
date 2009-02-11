#!/usr/bin/env js
var whereAmI = (function(){
  return new File((new Error).stack.split("\n")[2].split("@")[1].split(":").slice(0,-1).join(":")).parent.toString();
})()
load(whereAmI + "/lib/bootstrapper.js");
(function() {
  var findTests = function(testDir) {
    var testFiles = [];
    var foundFiles = new File(testDir).list();
    for (var i=0; i<foundFiles.length; i++) {
      if (new File(foundFiles[i]).isDirectory) {
        var testFiles = testFiles.concat(findTests(foundFiles[i]))
      } else if ((new RegExp('.*_test\.js$')).test(foundFiles[i])) {
        testFiles.push(foundFiles[i]);
      }
    }
    return testFiles;
  };

  var loadTests = function(tests) {
    for (var i=0; i<tests.length; i++) { load(tests[i]); }
  };
  
  var runTests = function() {
    var runner = new TestCase.Runner; 
    runner.runTests();
  };
  
  loadTests(findTests(environment['TESTS'] || (__DIR__ + "/test")));
  runTests();
})();