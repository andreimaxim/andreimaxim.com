---
layout: post
title: Adding SimpleCov to a Rails app
date: 2026-01-27
description: 
---

I've stopped using code coverage tools a number of years ago as the effort
to maintain a test suite with 100% code coverage was quite significant, but
nowadays the coverage report can be a useful tool when working with LLMs.

Unfortunately, the recommended SimpleCov setup for Ruby on Rails does not work
because Rails now uses a parallel test runners and SimpleCov needs to be setup
accordingly, otherwise you'd get much lower coverage numbers than you'd expect.

I've landed on this approach based on the template from [Rails Templates][templates],
with a sightly different setup and ignoring the `CI` environment variable,
because it [can cause discrepancies][coverage-errors].

[templates]: https://railstemplates.org/simplecov-rails/
[coverage-errors]: https://reinteractive.com/articles/tutorial-series-for-experienced-rails-developers/CI-simplecov-and-coverage-discrepancies

First, let's look at how the default Rails `test/test_helper.rb` file looks like:

```ruby
ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end
```

First, let's create a `test/coverage_test.rb` file with the SimpleCov setup as
per the gem's instructions.

Note that the file has an early return so the rest of the code is never executed
unless the correct environment variable is present (Ruby is a scripting language
as well!).

```ruby
return unless ENV["COVERAGE"]

require "simplecov"

SimpleCov.start "rails" do
  # Add custom groups
  # e.g. add_group "Services", "app/services"

  # Exclude files from coverage
  add_filter "/test/"
  add_filter "/config/"
  add_filter "/vendor/"
  add_filter "/lib/generators/"

  # Enable branch coverage
  enable_coverage :branch
end
```

Now, we need to create a concern that we'll mix into the `ActiveSupport::TestCase`
class to ensure that SimpleCov combines the coverage results across all
parallel test runners, which I've created as `test/test_helpers/coverage_test_helper.rb`:

```ruby
module CoverageTestHelper
  extend ActiveSupport::Concern

  included do
    parallelize_setup do |worker|
      SimpleCov.command_name "#{SimpleCov.command_name}-#{worker}"
    end

    parallelize_teardown do |worker|
      SimpleCov.result
    end
  end
end
```

Finally, let's require the `test/coverage_helper.rb` file as close to the top
as possible, add a line that automatically requires the files in the `test/test_helpers`
folder and then add the mixin if the `COVERAGE` environment variable is set:

```ruby
ENV["RAILS_ENV"] ||= "test"

require_relative "coverage_helper"
require_relative "../config/environment"
require "rails/test_help"

# Automatically load all test helpers
Dir[Rails.root.join("test", "test_helpers", "**", "*.rb")].each { |file| require file }

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors)
    include CoverageTestHelper if ENV["COVERAGE"]

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    # Add more helper methods to be used by all tests here...
  end
end
```

You now see you application's test coverage by running:

```bash
COVERAGE=true bin/rails test
```
