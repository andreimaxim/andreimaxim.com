---
layout: post
title: "Book review: Professional Rails Testing"
---

I've often found that most resources around testing (especially around Test-Driven Development) tend to use very contrived examples which may be easy to ingest by the readers, but difficult to put into practice. If you are a Ruby on Rails developer and you still have questions on how to bridge the gap between testing theory and practice, [Jason Swett's "Professional Rails Testing" book](https://www.amazon.com/Professional-Rails-Testing-Tools-Principles/dp/B0DJRLK93M) is one of the better options out there, even though the title is a bit too ambitious.

The book is 200 pages long and slightly more than half of it covers the principles around testing and TDD, with plenty of examples, while the rest of the book is about the tools he is using in his examples: RSpec, FactoryBot and Capybara. This is probably the main criticism I have against "Professional Rails Testing," as he chose the popular tools, not the default ones.

I'd also argue that RSpec tends to be a poor choice when teaching people about TDD since it comes with a steeper learning curve due to its DSL.

Let's look at the following example from page 19:

```ruby
RSpec.describe "expression parser" do
  context "the expression involves multiplication without an explicit operator" do
    it "assigns the multiplication operator to the root" do
      expression = Expression.parse("2x")
      expect(expression.root).to eq("*")
    end

    it "assigns the first operand to the left child" do
      expression = Expression.parse("2x")
      expect(expression.left_child).to eq(2)
    end

    it "assigns the second operand to the right child" do
      expression = Expression.parse("2x")
      expect(expression.right_child).to eq("x")
    end
  end
end
```

I find the code overly verbose and most people will feel like there's a lot of typing involved.

Even if we extract the `expression` into a variable using a `subject`, the code still *feels* a bit too complex due to the DSL:

```ruby
RSpec.describe "expression parser" do
  context "multiplication without explicit operator" do
    subject(:expression) { Expression.parse("2x") }

    it { expect(expression.root).to eq("*") }
    it { expect(expression.left_child).to eq(2) }
    it { expect(expression.right_child).to eq("x") }
  end
end
```

 Let's see an alternative implementation using the Rails default framework:

```ruby
class ExpressionParserTest < ActiveSupport::TestCase
  test "multiplication without explicit operator" do
    expression = Expression.parse("2x")

    assert_equal "*", expression.root
    assert_equal 2, expression.left_child
    assert_equal "x", expression.right_child
  end
end
```

There's a whole chapter dedicated to duplication in test code, which I *think* is mainly aimed at RSpec's `shared_examples` feature, and another chapter about Ruby blocks, procs, lambdas and `instance_exec`, which I *think* is there to help the reader understand what RSpec is doing behind the scenes.

That being said, I think "Professional Rails Testing" does a great job of explaining the core concepts and subtleties around testing (the first part of the book), I just feel Ruby and Rails communities already has two great books about testing with RSpec in [Effective Testing with RSpec 3](https://pragprog.com/titles/rspec3/effective-testing-with-rspec-3/) and [Rails 5 Test Prescriptions](https://pragprog.com/titles/nrtest3/rails-5-test-prescriptions/), and I think it's a bit redundant to have yet another book featuring RSpec in the context of Rails.

Happy reading!