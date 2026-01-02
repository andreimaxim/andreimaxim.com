---
layout: post
title: Alternatives to Ruby classes
date: 2026-01-02
---

I've noticed that many Ruby developers tend to suffer from "classitis,"
as coined by John Ousterhout in his "A Philosophy of Software Design,"
where there is an explosion of shallow modules (or, in our case, classes)
instead of having fewer deep modules.

I understand the general criticism that `ActionController` instances
aren't really objects, but sure this can't be the best alternative:

```ruby
module Bookshelf
  module Actions
    module Home
      class Index < Bookshelf::Action
        def handle(request, response)
        end
      end
    end
  end
end
```

It gets even worse when you consider the proliferation of the `ServiceObject`
pattern in the Ruby and Rails codebases, which often looks like this:

```ruby
class BookCreator
  def self.call(*args)
    new(*args).call
  end

  def initialize(title:, description:, author_id:, genre_id:)
    @title = title
    @description = description
    @author_id = author_id
    @genre_id = genre_id
  end

  def call
    create_book
  end

  private
    def create_book
      Book.create!(
        title: @title
        description: @description
        author_id: @author_id
        genre_id: @genre_id
      )
    rescue ActiveRecord::RecordNotUnique => e
      # handle duplicate entry
    end
end
```

This whole class (which is basically a Factory) could have been a method:

```ruby
class Book
  class << self
    def create_unique(params)
      Book.create!(params)
    rescue ActiveRecord::RecordNotUnique => e
      # handle duplicate entry
    end
  end

  # rest of the code
end
```

So I was pleasantly surprised when I saw Dave Thomas's talk at SFRuby titled
"Stop Using Classes, which I'd highly recommend watching:

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/sjuCiIdMe_4?si=VB4h1hOxi_pAIGbp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Below are my notes about some the arguments he is making.

## When to use `module` instead of `class`

In Ruby, there are two main differences between modules and classes:

- Modules are not instantiable (there isn't a `Module.new` method)
- Modules can be mixed into other modules or classes

Or, if we frame it in a different way, you should use a `module` instead
of a `class` when **you need a namespace for related functions**
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

Since it doesn't make sense to instantiate the above class at all,
let's replace it with a module:

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

The `StrategyBase` class actually represents a _behavior_ which
we want to _mix into_ our `UserStrategy` and `AdminStrategy` objects,
so why not be explicit about that and convert it to a `Module`?

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

The main advantage is that adding behaviors to classes via mixins scales
much better than using inheritance:

```ruby
class AdminStrategy
  include Runnable, Retriable, Loggable
end

class UserStrategy
 include Runnable, Retriable, Loggable
end

class GuestStrategy
  include Runnable, Expirable
end
```

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
because the convention is that all files in `app/jobs` are expected to always be
a type of job, but this might not be as clear in other parts of the codebase
(e.g. `app/models`).

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

## Naming classes after design patterns

Dave Thomas says that if your class is named after a design pattern,
then it's a smell. While I agree that in Ruby we don't need to have
a dedicated `UserFactory` class and just use a class method (e.g.
`User#build_admin`), I think his advice is less applicable down when
we go beyond the design patterns presented in the GoF book.

For example, I don't think it's a smell that you have a `RemindersJob`,
or a `UsersController` class even though both contain the name of the
pattern ("job" and "controller").

## Abstract classes

I wrote my fair share of abstract classes and the logic behind it was
that they provided core functionality for the classes that inherited
from it (e.g. populating the model with data pulled from a specific URL).

However, looking back, I think I always got to a place where I'd had
methods that would just raise some sort of `NotImplementedError`, or
I would have to override the `initialize` method and I'm fairly sure
that using a mix-in would have been much cleaner.

## Final thoughts

I think PragDave was a bit too dramatic when he titled his talk
"Stop using classes," but otherwise I highly agree with the points
that he's making.

Whenever you reach for a class, you are also inviting a lot of complexity,
which could be avoided by using other tools, like `Module` (which
is stateless) or `Data` (which is immutable), that could be easier
to reason about since they are generally simpler. Also, refactoring
from a `Module` or `Data` to a `Class` is generally extremely
trivial.

That being said, I also think there's a lot of _essential complexity_
that you need to manage and, often, objects and classes can be
extremely helpful.
