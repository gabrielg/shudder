task :default => %w[test:suitescripts test:jslint]
task :test => %w[test:suitescripts]
require 'pathname'

namespace :test do
  desc "Runs the suitescript tests."
  task :suitescripts do
    Dir.glob((Pathname.new(__FILE__).parent + "test/**/*_test.js")).each do |t|
      pid = fork { exec("js -f lib/bootstrapper.js #{t}") }
      Process.waitpid(pid)
    end
  end
  
  desc "Runs JS Lint against all JS files"
  task :jslint do
    puts("Running JS Lint...")
    Dir.glob((Pathname.new(__FILE__).parent + "{test,validations}/**/*.js")).each do |t|
      pid = fork { exec("jsl -conf config/jsl.conf -nologo -nosummary -process #{t}") }
      Process.waitpid(pid)
    end
  end
  
end
