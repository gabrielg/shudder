load(__DIR__ + "/console_outputter.js");

TestCase.Runner = function(outputter) {
  this.outputter = outputter || (new TestCase.ConsoleOutputter);
  this._resetRunStats();
}

TestCase.Runner.prototype = {
  
  runTests: function() {
    this.outputter.listTests(TestCase.cases);
    for (var i=0; i < TestCase.cases.length; i++) {
      TestCase.cases[i].run(this)
    }
  },
  
  caseStarted: function(testCase) {
    this._resetRunStats();
    this.outputter.caseStarted(testCase)
  },
  
  caseFinalized: function(testCase) {
    this.outputter.caseFinalized(testCase, {passes: this.passedRuns, failures: this.failedRuns, errors: this.erroredRuns})
  },
  
  shouldPassed: function(runContext) {
    this.passedRuns.push(runContext);
    this.outputter.showPass(runContext);
  },
  
  shouldFailed: function(runContext) {
    this.failedRuns.push(runContext);
    this.outputter.showFailure(runContext);
  },
  
  shouldErrored: function(runContext) {
    this.erroredRuns.push(runContext);
    this.outputter.showError(runContext);
  },
  
// Private
  
  _resetRunStats: function() {
    this.passedRuns = [], this.failedRuns = [], this.erroredRuns = [];
  }
  
};
