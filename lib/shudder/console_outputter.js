TestCase.ConsoleOutputter = function(outputStream) {
  this.outputStream = outputStream || File.output;
};

TestCase.ConsoleOutputter.prototype = {
  info: function(infoText) {
    this._out(infoText);
  },
  
  listTests: function(testList) {
    var caseNames = [];
    for (var i=0; i < testList.length; i++) { caseNames.push(testList[i].caseName) }
    this._out("Running all test cases: " + caseNames.join(", "))
  },
  
  caseStarted: function(testCase) {
    var tCount = testCase.shouldCount();
    if (tCount > 0) {
      this._out("Case: " + testCase.caseName + "; Test Count: " + tCount);
    }
  },
  
  caseFinalized: function(testCase, runData) {
    this._out("\n");
    var outStats = runData.passes.length+" passes, "+runData.failures.length+" failures, "+runData.errors.length+" errors.";
    this._out(outStats);
    this._out("");
    this._showDiagnostics(runData.failures.concat(runData.errors))
  },
  
  showFailure: function() {
    this._out('F', false);
  },
  
  showError: function() {
    this._out('E', false);
  },
  
  showPass: function() {
    this._out('.', false);    
  },
  
// Private
  _showDiagnostics: function(brokenRuns) {
    for (var i=0; i < brokenRuns.length; i++) { 
      var run = brokenRuns[i];
      this._showDiagnosticsForRun(run)      
    }
  },
  
  _showDiagnosticsForRun: function(runContext) {  
    var msg = (runContext.lastException.name == "AssertionFailure") ? "Failure: " : "Error: "
    this._out(msg + runContext.shouldName);  
    this._showException(runContext);
  },

  _showException: function(runContext) {
    var lastException = runContext.lastException;
    this._out(lastException.name + ': ' + lastException.message);
    this._out(lastException.stack)
  },
  
  _out: function(string, addNewline) {    
    if (addNewline === undefined || addNewline) { var string = string + "\n"; }
    this.outputStream.write(string);
  }
  
};