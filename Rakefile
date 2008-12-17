task :default => %w[test:suitescripts test:jslint]
task :test => %w[test:suitescripts]
require 'pathname'

namespace :test do
  desc "Runs the suitescript tests."
  task :suitescripts do
    cmd_parts = Dir.glob((Pathname.new(__FILE__).parent + "test/**/*_test.js")).inject([]) do |parts,tfile|
      parts << "-f" << tfile
    end
    cmd_parts.concat(["-f", "lib/shudder/runner.js", "-e", "var runner = new TestCase.Runner; runner.runTests();"])
    pid = fork { exec("js", "-f", "lib/bootstrapper.js", *cmd_parts) }
    Process.waitpid(pid)
  end
  
  desc "Runs JS Lint against all JS files"
  task :jslint do
    puts("Running JS Lint...")
    Dir.glob((Pathname.new(__FILE__).parent + "{test,lib}/**/*.js")).each do |t|
      pid = fork { exec("jsl -conf config/jsl.conf -nologo -nosummary -process #{t}") }
      Process.waitpid(pid)
    end
  end
  
end
