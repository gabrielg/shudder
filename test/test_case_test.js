TestCase.define("Test Cases", function(){

  this.context("when being defined", function(){
    
    this.context("regardless of any tests being specified", function(){
    
      this.should("not define the case when instantiating the object", function(){
        var definitionFunction = function(){};
        mock(definitionFunction).expects('call').never();
        var testCase = new TestCase('a test testcase', definitionFunction);      
      });
    
      this.should("call the case definition function in the context of the case with defineCase()", function(){
        var definitionFunction = function(){};
        var testCase = new TestCase('a test testcase', definitionFunction);
        mock(definitionFunction).expects('call').with(testCase);
        testCase.defineCase();
      });    
    
      this.should("have a case name", function(){
        var testCase = new TestCase('a test testcase', function(){});
        this.assertEqual('a test testcase', testCase.caseName);
      });        
    });

    this.context("with no tests yet specified", function(){
    
      this.setup(function(){
        this.testCase = new TestCase('a test testcase', function(){});
        this.testCase.defineCase();
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
    }); // with no tests

  
    this.context("with just tests and no subcontexts", function(){
    
      this.setup(function(){
        this.testCase = new TestCase('a test testcase', function(){
          this.should("be awesome", function(){ })
        });
        this.testCase.defineCase();
      }); // setup

      this.should("have an empty setups collection", function(){
        this.assert(this.testCase.setups.length === 0);
      });
    
      this.should("have an empty teardowns collection", function(){
        this.assert(this.testCase.teardowns.length === 0);
      });
    
      this.should("have an empty contexts collection", function(){
        this.assert(this.testCase.contexts.length === 0);      
      });
      
      this.should("have one should definition", function(){
        this.assert($H(this.testCase.shouldDefinitions).keys().length === 1);
      });
    
    }); // with tests and no subcontexts
    
  }); // when being defined
}).run();