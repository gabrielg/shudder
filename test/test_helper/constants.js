global = this;
(function(){
  // Defines a __FILE__ constant of sorts.
  this.__defineGetter__("__FILE__", function() {
    return (new File((new Error).stack.split("\n")[2].split("@")[1].split(":").slice(0,-1).join(":"))).toString();
  });
  
  // Defines a __DIR__ constant of sorts.
  this.__defineGetter__("__DIR__", function() {
    return (new File((new Error).stack.split("\n")[2].split("@")[1].split(":").slice(0,-1).join(":"))).parent.toString();
  });
  
  global.SHUDDER_ROOT = new File((new File(__FILE__)).parent + "/../../").toString();
})();
