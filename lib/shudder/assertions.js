TestCase.AssertionFailure = function(msg) {
  this.message = "Assertion Failed: " + msg;
  this.name = "AssertionFailure";
};

TestCase.AssertionFailure.prototype = new Error();

TestCase.Assertions = {
  assert: function(assertVal, assertionMessage) {
    var casted = !!assertVal;
    if (!assertionMessage) { assertionMessage = casted.toString() + " expected to be true"; }    
    (casted) ? this.pass() : this.fail(assertionMessage);
  },

  // FIXME - make the assertion stuff better. More refactors, once there's more tests in place
  // to refactor against.
  assertEqual: function(expected, actual, assertionMessage) {
    if (expected == actual) {
      this.pass();
    } else {
      this.fail(assertionMessage || 'assertEqual failed');
    }
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
