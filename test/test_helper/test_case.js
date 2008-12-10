var TestCase = function(caseName, caseDefinition) {
  this.caseName = caseName;
  this.caseDefinition = caseDefinition;
  this.shouldDefinitions = {};
  this.testNonPasses = [];
  this.setups = [];
  this.teardowns = [];
  this.contexts = [];
  this.defineCase();
};

TestCase.AssertionFailure = function(msg) {
  this.message = "Assertion Failed: " + msg;
  this.name = "AssertionFailure";
};

TestCase.AssertionFailure.prototype = new Error();

TestCase.define = function(caseName, caseDefinition) {
  return new TestCase(caseName, caseDefinition);
};

TestCase.prototype = {
  defineCase: function() {
    this.caseDefinition.call(this);
  },

  run: function(showErrors) {
    this.out("Running tests for " + this.caseName);
    this._runShoulds();
    this._runContexts();
    if (showErrors === undefined) { this._showAllNonPasses(); }
  },

  should: function(shouldName, shouldDefinition) {
    this.shouldDefinitions["test: " + this.caseName + " should " + shouldName] = shouldDefinition;
  },

  setup: function(setupFunction) {
    this.setups.push(setupFunction);
  },
  
  teardown: function(teardownFunction) {
    this.teardowns.push(teardownFunction);
  },
  
  out: function(string, addNewline) {
    if (addNewline === undefined || addNewline) { var string = string + "\n"; }
    File.output.write(string);
  },
  
  debug: function(string) {
    if (!TestCase.debug) { return(null); }
    this.out(string);
  },
  
  context: function(contextName, contextDefinition) {
    var newCase = new TestCase(contextName, contextDefinition);
    newCase._inheritAsContext(this);
    this.contexts.push(newCase);
  },
  
// Protected  
  _inheritAsContext: function(otherCase) {
    this.setups = otherCase.setups.concat(this.setups);
    this.teardowns = otherCase.teardowns.concat(this.teardowns);
    this.caseName = otherCase.caseName + ' ' + this.caseName;
  },
  
// Private
  _runContexts: function() {
    for (var i=0; i < this.contexts.length; i++) { this.contexts[i].run(); }
  },
  
  _runShoulds: function() {
    for (var shouldName in this.shouldDefinitions) { this._runShould(shouldName); }
    this.out(""); // So we get a newline after the F, E, and . have printed
  },

  _runShould: function(shouldName) {
    this.debug("Running should: '" + shouldName + "' in context: '" + this.caseName + "'");
    try {
      var testRunContext = new TestCase.ShouldRunContext(this.setups, this.teardowns, this.shouldDefinitions[shouldName]);
      testRunContext.run();
      this._addPass(shouldName);
    } catch (e if e.name == "AssertionFailure") {
      this._addFailure(shouldName, e);
    } catch (e) {
      this._addError(shouldName, e);
    }
  },

  _addPass: function(shouldName) {
    // Just prints a "." for now
    this.out(".", false);
  },

  _addFailure: function(shouldName, error) { 
    this.out("F", false); // TODO - maybe split this into a showFailure
    this.testNonPasses.push({type: 'Failure', should: shouldName, error: error});
  },

  _addError: function(shouldName, error) { 
    this.out("E", false); // TODO - maybe split this into a showError
    this.testNonPasses.push({type: 'Error', should: shouldName, error: error});
  },

  _showAllNonPasses: function() {
    if (this.testNonPasses.length > 0) {
      for (var i=0; i < this.testNonPasses.length; i++) { this._showNonPass(this.testNonPasses[i]); }
    } else {
      this.out("All tests passed successfully.");
    }
  },

  _showNonPass: function(nonPassData) {
    this.out("---");
    this.out(nonPassData.should);
    this.out(nonPassData.type + ": " + nonPassData.error.message);
    this.out("---");
  }
}; // TestCase.prototype


TestCase.ShouldRunContext = function(setups, teardowns, shouldDefinition) {
  this.setups = setups;
  this.teardowns = teardowns;
  this.shouldDefinition = shouldDefinition;
  this.postShould = TestCase.ShouldRunContext.postShould;
};

// For hooking things like Ersatz in
TestCase.ShouldRunContext.postShould = function() {};

TestCase.ShouldRunContext.prototype = {
  run: function() {
    try {
      this._runSetups();
      this._runShould();
      this._runPostShould();
    } finally {
      this._runTeardowns();
    } // try
  },  // run
  
// Private
  
  _runSetups: function() {
    for (var i=0; i < this.setups.length; i++) { this.setups[i].call(this); }
  },
  
  _runShould: function() {
    this.shouldDefinition.call(this);
  },
  
  _runTeardowns: function() {
    for (var i=0; i < this.teardowns.length; i++) { this.teardowns[i].call(this); }
  },
  
  _runPostShould: function() {
    this.postShould.call(this);
  }
};


load(__DIR__ + "/test_case/assertions.js");
load(__DIR__ + "/test_case/ersatz_support.js");