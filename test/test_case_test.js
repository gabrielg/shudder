TestCase.define("Test Case", function(){

  this.context("with no tests", function(){
    
    this.setup(function(){
      this.testCase = new TestCase('a test testcase', function(){});
    });
    
    this.should("have an empty setups collection", function(){
      this.assert(this.testCase.setups.length === 0);
    });
    
    this.should("have an empty teardowns collection", function(){
      this.assert(this.testCase.teardowns.length === 0);
    });
    
    this.should("have an empty contexts collection", function(){
      this.assert(this.testCase.contexts.length === 0);      
    });

    this.should("have an empty should definition collection", function(){
      this.assert($H(this.testCase.shouldDefinitions).keys().length === 0);
    });
    
    this.should("have a case name", function(){
      this.assertEqual('a test testcase', this.testCase.caseName);
    });
    
    this.should("call the case definition function in the context of the case", function(){
      var definitionFunction = function(){};
      mock(definitionFunction).expects('call').with_expression(function(passedTestCase){
        return (passedTestCase instanceof TestCase);
      });
      var testCase = new TestCase('a test testcase', definitionFunction);
    });
    
  }); // with no tests

}).run();