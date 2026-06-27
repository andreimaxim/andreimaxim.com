---
layout: post
title: Stop using Service Objects
date: 2026-06-27
description: Why Service Objects are an antipattern and a plea for the Rails community to stop using Service Objects
---

I've been reading [Brandom Weaver's "Callbacks Are Not Invariants"][callbacks] article from his ["Rails: The Sharp Parts][rsp]
series and I couldn't help myself roll my eyes when I saw the "service object" solution to the "callback problem".

[callbacks]: https://baweaver.com/writing/2026/06/13/rails-sharp-parts-callbacks-are-not-invariants/
[rsp]: https://baweaver.com/tags/rails-sharp-parts/

Just to make it clear, by "service object" I mean specifically this pattern:

```ruby
module Noun
  class Verb
    def call(params)
      do_actual_work(params)
    end

    private
      def do_actual_work(params)
        # do stuff
      end
  end
end
```

Sometimes there some slight variations to this approach, like having a class method `call()` that accepts the params
and handles the initialization, so instead of `Noun::Verb.new.call(params)` you'd use `Noun::Verb.call(params)`, but
the gist of it is the same.

I have two main issues with service objects.

First, they are very poorly defined. In most cases, they represent objects that respond to a `call()` method, but I've seen
developers say "service objects" when they actually mean a non-ActiveRecord object. There's an attempt to define
"service objects" in a [2021 RailsConf talk "Missing Guide to Service Objects in Rails"][missing-guide-to-service-objects]
as "code that represents and executes business processes specific to your application", but this is still extremely vague.

[missing-guide-to-service-objects]: https://www.youtube.com/watch?v=MCTwjE-vp2s

Second, the pattern offers no insight outside of the above mentioned `call()` method. If I say "this is an Active Record" you
understand the object is persisted to a database table. If I say "this is a workflow" you understand that the object will perform
a sequence of actions. If I say "this is a domain model" you understand that the object models a part of the business domain.

In fact, I'd argue the concept of "service object" is so broad and vague that it fits even ActiveJob objects. Yes, you can call
them service objects, but does it provide any value? Do you often refer to them as "service objects" or as "jobs"?

Another aspect that I don't like in the implementations I've seen so far is that, since they generally to interact with multiple
other objects, service objects tend to know too many things about the internals of the other objects, breaking the encapsulation.

Brandon does not say "service object" directly, but the shape of his "command" interface is very similar to what I described
above:

```ruby
class ApplicationCommand
  def self.call(...)
    new(...).call
  end

  private_class_method :new

  def call
    execute
  end

  private
    def execute
      raise NotImplementedError, "#{self.class.name} must define #execute"
    end
end
```

The actual "commands" inherit from `ApplicationCommand` and here's the complete example from the blog post:

```ruby
module Seats
  class ReserveSeat < ApplicationCommand
    def initialize(seat_id:, by:)
      @seat_id = seat_id
      @by = by
    end

    private

    attr_reader :seat_id, :by
    def payload = {seat_id:, by:}

    def execute
      seat = reserve
      announce(seat)
      seat
    end

    def reserve
      seat = Seat.find(seat_id)
      seat.with_lock do
        raise AlreadyReserved, "seat #{seat_id} is already reserved" if seat.reserved?

        seat.update!(reserved: true, reserved_by: by)
        Ledger::RecordReservation.call(seat: seat, by: by)
      end

      seat
    end

    def announce(seat)
      ReservationMailer.confirmed(seat).deliver_later
      Webhooks::Emit.call(event: :seat_reserved, record: seat)
    end
  end
end
```

I've said above that this "service object" pattern contorts the object (in this case `Seats::ReserveSeat`) to behave
like a method and I think this is a great example to show the alternative, which would be a `reserve(by:)` method
on the `Seat` model:

```ruby
def reserve(by:)
  with_lock do
    raise AlreadyReserved, "seat #{id} is already reserved" if reserved?
    update!(reserved: true, reserved_by: by)
    Ledger::RecordReservation.call(seat: self, by: by)
  end

  ReservationMailer.confirmed(self).deliver_later
  Webhooks::Emit.call(event: :seat_reserved, record: self)
end
```

I'd argue that the second version is much easier to parse and it's far superior when debugging because you'd be able
to quickly navigate via the LSP to the `reserve()` method on the `Seat` model, while the `call()` method definition is on
the `ApplicationCommand` object so you need to know that in order to jump to the `Seats::ReserveSeat` class, then
keep in mind that the `call()` method calls `execute()`, then bounce through `reserve()` and `announce(seat)` to understand
the entire logic.

The main reason why Brandon is going down this route is because of ActiveRecord callbacks and he gives two examples.

The first one is a backfilling operation and he offers two options:

```ruby
Order.where(region: nil).find_each do |order|
  order.update!(region: "us-west-2")
end

# or

Order.where(region: nil).update_all(region: "unknown")
```

Once you look at the model, you'll quickly realize that neither solution is great, because the first option
will sync all the orders to the CRM, while the second one will not push the updated order in the search index:

```ruby
class CompositeOrder < ActiveRecord::Base
  self.table_name = "orders"

  before_validation :normalize_email
  before_save :compute_totals, if: :line_items_changed?
  before_save :apply_loyalty_tier, unless: :imported?
  after_save :update_search_index
  after_save :recalculate_inventory, if: :saved_change_to_status?
  after_commit :sync_to_crm
  after_commit :notify_fulfillment, if: -> { saved_change_to_status?(to: "paid") }

  # more code
end
```

My main counter argument here is that you'll always want to be treat backfilling data operations with care and do at least
a test run with production-like data. Changing your architecture because somebody might initiate a backfill operation out
of the blue without testing it at all is a strange decision.

While abusing callbacks is obviously a bad idea, I think we got to the point where the cure is worse than the disease.
If we think of LLMs as a mirror to our own code, I have to say I don't remember the last time when an LLM generated a callback,
while every other day I have to tell LLMs to not generate yet another service object.
