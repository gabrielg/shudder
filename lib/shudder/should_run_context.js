TestCase.ShouldRunContext = function(setups, teardowns, shouldName, shouldDefinition) {
  this.setups = setups;
  this.teardowns = teardowns;
  this.shouldDefinition = shouldDefinition;
  this.shouldName = shouldName;
  this.postShould = TestCase.ShouldRunContext.postShould;
};

// For hooking things like Ersatz in
TestCase.ShouldRunContext.postShould = function() {};

TestCase.ShouldRunContext.prototype = {
  run: function(runner) {
    try {
      this._runSetups();
      this._runShould();
      runner.shouldPassed(this);
    } catch (e) {
      this._handleException(e, runner);
    } finally {
      this._postShouldCleanup();
    } // try
  },  // run
  
// Private
  
  _postShouldCleanup: function() {
    this._runTeardowns();
    this._runPostShould();
  },
  
  _handleException: function(exc, runner) {
    this.lastException = exc;
    (exc.name == "AssertionFailure") ? runner.shouldFailed(this) : runner.shouldErrored(this);
  },
  
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