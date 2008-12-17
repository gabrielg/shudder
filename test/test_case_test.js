TestCase.define("Test Cases", function(){

  this.should("add themselves to the test collection when being defined", function(){
    var newCase = TestCase.define("testing", function() { });
    this.assertEqual(newCase, TestCase.cases[TestCase.cases.length - 1]);
    TestCase.cases.pop();
  });

  this.should("call defineCase() when using the define 'class method'", function(){
    // Hand mocking this one so we dont dump all the Ersatz methods onto TestCase.prototype
    var originalDefineCase = TestCase.prototype.defineCase;
    var defineCalled = false;
    try { 
      TestCase.prototype.defineCase = function() { defineCalled = true; };
      var newCase = TestCase.define("testing", function() { });
      TestCase.cases.pop();
    } finally {
      TestCase.prototype.defineCase = originalDefineCase;
    }
    this.assert(defineCalled);
  });
    
  this.context("regardless of any tests being specified", function(){
        
    this.should("not define the case when instantiating the object", function(){
      var definitionFunction = function(){};
      mock(definitionFunction).expects('call').never();
      var testCase = new TestCase('a test testcase', definitionFunction);
    });
  
    this.should("call the case definition function in the context of the case with defineCase()", function(){
      var definitionFunction = function(){};
      var testCase = new TestCase('a test testcase', definitionFunction);
      mock(definitionFunction).expects('call').having(testCase);
      testCase.defineCase();
    });    
      
    this.should("have a case name", function(){
      var testCase = new TestCase('a test testcase', function(){});
      this.assertEqual('a test testcase', testCase.caseName);
    });
    
  }); // regardless of any tests being specified

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
  }); // with no tests yet specified


  this.context("with just tests and no subcontexts", function(){
  
    this.setup(function(){
      this.testCase = new TestCase('a test testcase', function(){
        this.should("be awesome", function(){ });
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

  this.context("with tests, setups, teardowns", function(){
  
    this.setup(function(){
      this.testCase = new TestCase('a test testcase', function(){
        this.setup(function(){ });
        this.setup(function(){ });
        
        this.should("be awesome", function(){ });
        
        this.teardown(function(){ });
        this.teardown(function(){ });
        this.teardown(function(){ });
      });
      this.testCase.defineCase();
    }); // setup

    this.should("have the correct number of setups in the setups collection", function(){
      this.assert(this.testCase.setups.length === 2);
    });
  
    this.should("have the correct number of teardowns in the teardowns collection", function(){
      this.assert(this.testCase.teardowns.length === 3);
    });
  
    this.should("have an empty contexts collection", function(){
      this.assert(this.testCase.contexts.length === 0);      
    });
    
    this.should("have one should definition", function(){
      this.assert($H(this.testCase.shouldDefinitions).keys().length === 1);
    });
  
  }); // with tests, setups, teardowns
})