load(SHUDDER_ROOT + "/vendor/ersatz/src/ersatz.js");

(function(){
  if (!this['Ersatz']) { return false; }
  TestCase.ShouldRunContext.postShould = function() {
    that = this;
    Ersatz.verifyExpectations(function(failureMessage){ that.assert(false, failureMessage); });
  };
})();