TestCase.Assertions = {
  assert: function(assertVal, assertionMessage) {
    var casted = !!assertVal;
    if (!assertionMessage) { assertionMessage = casted.toString() + " expected to be true"; }    
    (casted) ? this.pass() : this.fail(assertionMessage);
  },
  
  deny: function(assertVal) {
    this.assert(!assertVal);
  },
  
  pass: function() { return true; },

  fail: function(failureMessage) {
    throw(new TestCase.AssertionFailure(failureMessage));
  }
};

// Copy the assertions to the right context
(function() {
  for (var assertion in TestCase.Assertions) {
    TestCase.ShouldRunContext.prototype[assertion] = TestCase.Assertions[assertion];
  }
})();