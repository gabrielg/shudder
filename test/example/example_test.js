TestCase.define("Examples", function(){
  
  this.context("when run", function(){
    
    this.should("assert true", function(){
      this.assert(true);
    });

    this.should("deny false", function(){
      this.deny(false);
    });
 
  });

}).run();