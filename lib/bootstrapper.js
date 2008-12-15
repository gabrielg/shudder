global = this;
(function() {
  var hackyStack = function() { return new File((new Error).stack.split("\n")[2].split("@")[1].split(":").slice(0,-1).join(":")); };
  // Defines a __FILE__ constant of sorts.
  this.__defineGetter__("__FILE__", function() { return hackyStack().toString(); });
  // Defines a __DIR__ constant of sorts.
  this.__defineGetter__("__DIR__", function() { return hackyStack().parent.toString(); });
  global.SHUDDER_ROOT = new File(__DIR__ + "/../").toString();
  
  // Load 'em up
  load(__DIR__ + "/shudder.js");
})();