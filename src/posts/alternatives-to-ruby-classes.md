---
layout: post
title: Alternatives to Ruby classes
date: 2026-01-02
---

Even though I think I've reached the age when I wince a bit when I hear
"stop using classes" in an object-oriented language, I'd highly recommend
to every Ruby developer to watch Dave Thomas's talk from SFRuby:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/sjuCiIdMe_4?si=VB4h1hOxi_pAIGbp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The core argument is that the a lot of developers default to using `Class`
when other constructs are more appropriate.

While I agree with most of the points that Dave Thomas is making, I'll
attempt to reframe some of his arguments in order to make them slightly
more actionable.

## When to use `module` instead of `class`

In Ruby, there are two main differences between modules and classes:

- Modules are not instantiable (there isn't a `Module.new` method)
- Modules can be mixed into other modules or classes

Or, if we frame it in a different way, you should use a `module` instead
of a `class` when **you need a namespace for different related functions**
or when **you need to share code between different object types**.

The first case is rather straightforward.

Instead of the following class:

```ruby
class Utils
  def self.date_to_string(date)
    # code
  end
end
```

Use a module with `extend self`:

```ruby
module Utils
  extend self

  def date_to_string(date)
    # code
  end
end
```

The `extend self` part makes it obvious that the `Module` is used
as a namespace, which is a distinct advantage over classes.

A second use for `Module` is its ability to **mix in behavior**, thus
allowing you to share code between objects.

Here's a common pattern I've seen in several places:

```ruby
class StrategyBase
  def run
    run_setup
    perform
    run_callbacks
  end

  private
    def run_setup
      raise "Not implemented"
    end
end

class UserStrategy < StrategyBase
  private
    def run_setup
      # some user-specific setup code
    end
end

class AdminStrategy < StrategyBase
  private
    def run_setup
      # some admin-specific setup code
    end
end
```

You should prefer:

```ruby
module Runnable
  def run
    run_setup
    perform
    run_callbacks
  end
end

class UserStrategy
  include Runnable

  private
    def run_setup
      # some user-specific setup code
    end
end

class AdminStrategy
  include Runnable

  private
    def run_setup
      # some admin-specific setup code
    end
end
```

The advantage of this approach is that is scales much better when you want to add
more types of objects and some behaviors are not shared between all subclasses.

For example, imagine a `VisitorStrategy` that might inherit from `StrategyBase`,
while only the `UserStrategy` and `AdminStrategy` share the same logging
behaviors. The only solution in this case would be `LoggedInStrategy` which is
a subclass of the `StrategyBase` and then the `AdminStrategy` and `UserStrategy`
would inherit from `LoggedInStrategy` (yes, it already sounds complicated) and
suddenly we have an inheritance hierarchy that goes three levels deep.

These different approaches can be seen in `ActiveJob` and `Sidekiq`:

```ruby
class SomeJob < ActiveJob::Base
  def perform(*args)
  end
end

# vs

class SomeJob
  include Sidekiq::Job

  def perform(*args)
  end
end
```

The inheritance hierarchy is not a big issue in the case of `ActiveJob` mainly
because the convention is that all files in `app/jobs` are a type of job, but
this might not be as clear in other parts of the code (e.g. `app/models`).

## When to use a `Data` instead of `class`

Another common anti-pattern when it comes to using classes in Ruby is when
the class is actually a **data bag**. In that case, there are two better
constructs, but I'd like to single out the `Data` class.

So instead of:

```ruby
class Person
  attr_reader :first_name, :last_name, :age

  def initialize(first_name:, last_name:, age:)
    @first_name = first_name
    @last_name = last_name
    @age = age
  end
end
```

it would be better (and simpler!) to use:

```ruby
Person = Data.define(:first_name, :last_name, :age)
```

In both cases, the usage is identical:

```ruby
john = Person.new first_name: "John", last_name: "Doe", age: 42

john.first_name #=> "John
```

The `Data` class can also include helper methods, but keep in
mind that the object is frozen so you can't manipulate instance
variables after it was created:

```ruby
Person = Data.define(:first_name, :last_name, :age) do
  def full_name
    "#{first_name} #{last_name}"
  end
end
```

## Classes and design patterns

Dave Thomas says that if your class is named after a design pattern,
then it's a smell. While I agree that in Ruby we don't need to have
a dedicated `UserFactory` class and just use a class method (e.g.
`User#build_admin`), I think his advice is less applicable down when
we go beyond the design patterns presented in the GoF book.

For example, I don't think it's a smell that you have a `RemindersJob`,
or a `UsersController` class even though both contain the name of the
pattern ("job" and "controller").

## Final thoughts

The main reason why Dave Thomas is asking Ruby developers to stop
using classes (or at least use them less), is complexity.

Object-oriented programming helps us resolve the inherent difficulty
of modeling complex domains by allowing us model individual entities
and the interactions between them, but this doesn't come for free.

Reaching for a class every time can also invite a lot of complexity,
which could be avoided by using simpler tools, like `Module` (which
is stateless) or `Data` (which is immutable). Since their APIs
are very similar to that of a `Class`, any later refactors (if needed!)
should be rather trivial.
