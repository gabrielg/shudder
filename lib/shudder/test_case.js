var TestCase = function(caseName, caseDefinition) {
  this.caseName = caseName;
  this.caseDefinition = caseDefinition;
  this.shouldDefinitions = {};
  this.testNonPasses = [];
  this.setups = [];
  this.teardowns = [];
  this.contexts = [];
};

TestCase.cases = [];

TestCase.define = function(caseName, caseDefinition, addToCases) {
  var tc = new TestCase(caseName, caseDefinition);
  tc.defineCase();
  if (addToCases != false) { TestCase.addCase(tc); }
  return tc;
};

TestCase.addCase = function(testCase) {
  TestCase.cases.push(testCase);
};

TestCase.prototype = {
  defineCase: function() {
    this.caseDefinition.call(this);
  },

  run: function(runner) {
    runner.caseStarted(this);
    this._runShoulds(runner);
    this._runContexts(runner);
    runner.caseFinalized(this);
  },

  shouldCount: function() {
    var shouldCount = 0;
    for (var def in this.shouldDefinitions) { shouldCount += 1; }
    return shouldCount;
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
  
  debug: function(string) {
    if (!TestCase.debug) { return(null); }
    this.outputter.info(string);
  },
  
  context: function(contextName, contextDefinition) {
    var newCase = TestCase.define(contextName, contextDefinition, false);
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
  _runContexts: function(runner) {
    for (var i=0; i < this.contexts.length; i++) { this.contexts[i].run(runner); }
  },
  
  _runShoulds: function(runner) {
    for (var shouldName in this.shouldDefinitions) { 
      this._runShould(shouldName, runner); 
    }
  },

  _runShould: function(shouldName, runner) {
    var runContext = new TestCase.ShouldRunContext(this.setups, this.teardowns, shouldName, this.shouldDefinitions[shouldName]);
    runContext.run(runner);
  },

  _addPass: function(shouldName) {
    // TODO - ASSERTION COUNT.
    this.outputter.showPass(shouldName);
  },

  _addFailure: function(shouldName, error) { 
    // TODO - ASSERTION COUNT
    this.outputter.showFailure(shouldName, error);
    this.testNonPasses.push({type: 'Failure', should: shouldName, error: error});
  },

  _addError: function(shouldName, error) { 
    // TODO - ASSERTION COUNT
    this.outputter.showError(shouldName, error);
    this.testNonPasses.push({type: 'Error', should: shouldName, error: error});
  }
  
}; // TestCase.prototype