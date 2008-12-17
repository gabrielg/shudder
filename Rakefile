task :default => %w[test:shudder test:jslint]
task :test => %w[test:shudder]
require 'pathname'

namespace :test do
  desc "Runs the shudder tests."
  task :shudder do
    pid = fork { exec("js", "-f", "run_tests.js") }
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
