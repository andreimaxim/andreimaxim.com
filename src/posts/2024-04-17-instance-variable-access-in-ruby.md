---
layout: post
title: Instance Variable Access in Ruby
---
Instance variables (or instance attributes) in Ruby are prefixed with an `@` sign:

```ruby
class Person
  def initialize(salutation: nil, first_name:, last_name:)
    @salutation = salutation
    @first_name = first_name
    @last_name  = last_name
  end

  def name
    [ @salutation, @first_name, @last_name ].compact.join(" ")
  end
end

john = Person.new first_name: "John", last_name: "Doe"
john.name # => "John Doe"

sam = Person.new salutation: "Mr.", first_name: "Sam", last_name: "Johnson"
sam.name # => "Mr. Sam Johnson"
```

In the above example variables are accessed using the _direct variable access_ pattern, as
described by [Kent Beck in Smalltalk Best Practice Patterns](https://www.amazon.com/Smalltalk-Best-Practice-Patterns-Kent/dp/013476904X)
and it has been my preferred style, mainly because they easily stand out when you read the
code and allows you to differentiate between object methods and attributes.

The other approach is to use the _indirect variable access_ pattern, which can be done by
defining accessors:

```ruby
class Person
  attr_reader :salutation, :first_name, :last_name

  def initialize(salutation: nil, first_name:, last_name:)
    @salutation = salutation
    @first_name = first_name
    @last_name  = last_name
  end

  def name
    [ salutation, first_name, last_name ].compact.join(" ")
  end
end

john = Person.new first_name: "John", last_name: "Doe"
john.name # => "John Doe"

sam = Person.new salutation: "Mr.", first_name: "Sam", last_name: "Johnson"
sam.name # => "Mr. Sam Johnson"
```

The side effect of defining accessors is that they are now accessible by other objects,
which might not be something you want:

```ruby
john.name #=> "John"
sam.salutation #=> "Mr."
```

The solution is to define the accessors in a _private_ section:

```ruby
 class Person
  def initialize(salutation: nil, first_name:, last_name:)
    @salutation = salutation
    @first_name = first_name
    @last_name  = last_name
  end

  def name
    [ salutation, first_name, last_name ].compact.join(" ")
  end

  private

  attr_reader :salutation, :first_name, :last_name
end

john = Person.new first_name: "John", last_name: "Doe"
john.name # => "John Doe"
john.first_name # => NoMethodError: private method `first_name' called for 
                #    an instance of Person
```

While it may seem that the main difference between _indirect variable access_ and
_direct variable access_ patterns is mainly stylistic, it does have an impact
when using inheritance because you can override methods, but you can't override instance variables.

For example, the salutation of the members of a royal house need to start with "HRH"
from "His Royal Highness" or "Her Royal Highness" and has to include the title
(the [naming conventions for royalty and nobility are actually quite complex](https://en.wikipedia.org/wiki/Wikipedia:Naming_conventions_(royalty_and_nobility))).
If we used direct variable access, we would need to reimplement the `name` method:

```ruby
class Person
  def initialize(salutation: nil, first_name:, last_name: nil)
    @salutation = salutation
    @first_name = first_name
    @last_name  = last_name
  end

  def name
    [ @salutation, @first_name, @last_name ].compact.join(" ")
  end
end

class Royalty < Person
  def initialize(title:, first_name:, last_name: nil)
    @title = title
    @first_name = first_name
    @last_name = last_name
  end
  
  def salutation
    "HRH #{@title}"
  end

  def name
    [ salutation, @first_name, @last_name ].compact.join(" ")
  end
end

charles = Royalty.new title: "King", first_name: "Charles"
charles.name # => "HRH King Charles"
```

This also means that if we plan to support name suffixes later on we'll need to change
the `name` method in both the `Person` and `Royalty` classes.

On the other hand, if we use indirect variable access, we can override the `salutation`
attribute to always start with "HRH", while adding a suffix will require a change to
the `name` method only on the parent `Person` class:

```ruby
class Person
  def initialize(salutation: nil, first_name:, last_name: nil, suffix: nil)
    @salutation = salutation
    @first_name = first_name
    @last_name  = last_name
    @suffix     = suffix
  end

  def name
    [ salutation, first_name, last_name, suffix ].compact.join(" ")
  end

  private

  attr_reader :salutation, :first_name, :last_name, :suffix
end

class Royalty < Person
  def initialize(title:, first_name:, last_name: nil, suffix: nil)
    @title = title
    @first_name = first_name
    @last_name = last_name
    @suffix = suffix
  end
  
  def salutation
    "HRH #{title}"
  end

  private

  attr_reader :title
end

charles = Royalty.new title: "King", first_name: "Charles", suffix: "III"
charles.name # => "HRH King Charles III"
```

However, as you can see in this rather contrived example, it is not often that we
need to override an attribute in the parent class with a method in the child class, so,
at the end of the day, it's mostly a stylistic decision.

Also, as with every stylistic decision, it's much more important to be consistent,
at least at the class level.
