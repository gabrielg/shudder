(function() {
  // Bootstrapping for our __FILE__ constant()
  var testRootPath = (new File((new Error).stack.split("\n")[2].split("@")[1].split(":").slice(0,-1).join(":"))).parent.toString();
  var helpersPath = testRootPath + "/test_helper";
  load(helpersPath + "/constants.js");
  load(helpersPath + "/test_case.js");
})();