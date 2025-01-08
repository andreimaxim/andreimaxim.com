---
layout: post
title: In Relentless Pursuit of RESTful Webhooks
---
I've recently seen a code sample about working with Stripe webhooks in Rails 
applications and I've noticed the following code in the controller:

```ruby
class StripeController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [ :webhook ]

  def webhook
    # Sample code for handling Stripe webhook events
  end
end
```

First of all, I want to point out that creating good code examples is very hard 
and you always need to find a balance between good abstractions and code that is 
easy to understand by the reader. In this specific case, I'd argue coding best 
practices are secondary to clearing showing that the code we're interested is 
in this specific controller action.

However, I've seen cases where developers working with webhooks create controllers 
like in the above example, which often become the first [broken windows](https://en.wikipedia.org/wiki/Broken_windows_theory)
in an otherwise RESTful Rails application.

Fortunately, it's quite easy to avoid it.

The main issue here is the language used. On the Stripe (or any other third-party service) 
configuration page, we enter the URL of our [webhook](https://en.wikipedia.org/wiki/Webhook), 
so naturally that specific endpoint becomes "the webhook endpoint". But the webhook is the 
resource we created on the third-party application, not the resource received by our endpoint, 
which is the event (or, in our case, the payment event) that triggers the webhook.

Now that we have identified the resource we're working with, it's much easier to name 
the controller and use the REST pattern:

```ruby
class Payments::EventsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [ :create ]

  def create
    # Sample code for handling Stripe webhook events
  end
end
```

In practice, I've often found that spending a bit of time identifying the resources 
(which don't have to map to models!) in order to use almost exclusively RESTful 
endpoints greatly simplifies the controller, which is something that [DHH has spoken 
about in the past](https://fullstackradio.com/32) and 
[Derek Prior had presented at RailsConf 2017](https://www.youtube.com/watch?v=HctYHe-YjnE).
