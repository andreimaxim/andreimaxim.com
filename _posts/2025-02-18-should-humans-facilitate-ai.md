---
layout: post
title: Should Humans Facilitate AI?
---

One of the side-effects of hype is that people tend to want to participate. This is especially true in the programming community,
where you'll find a lot of tinkerers and the cost of accessing the shiny new thing is generally very low.

The problem is that during the hype cycle it's easy to confuse _innovation_ with _tinkering_. 

It happened with crypto, where the main innovation around the original idea of a blockchain was around an [internal algorithm][proof-of-stake] 
or [embedding a string][erc721], not around global finances as a whole[^1]. Despite the billions of dollars that were invested into
the crypto ecosystem, the only thing that really took off was the ability to create a new "coin" on a whim, which is 
[a decade-old innovation][erc20].

[proof-of-stake]: https://en.wikipedia.org/wiki/Proof_of_stake
[erc721]: https://ethereum.org/en/developers/docs/standards/tokens/erc-721/
[erc20]: https://eips.ethereum.org/EIPS/eip-20

I've been a paid LLM user since the GPT-4 was launched and I use it often as a programmer surrogate because I found a lot of value 
from writing down my ideas. But recently I've seen more and more projects adopt [a llms.txt file][llmstxt] in order to help machines
parse its contents.

[llmstxt]: https://llmstxt.org/

First, I don't think this approach is correct.

Should we remove stairs or doorknobs to help robots navigate our spaces? Should we change our furniture to help
with the development of robots that load or unload our food or clothes? Should we simplify our food recipes so they are easier to automate? 

Or should we build robots that can jump, walk, and move around objects just like we do in order to take over our some of our tasks?

Second, I don't think generating code, which is the main strength of LLMs when it comes to programming, is the use case we should optimize for.

Sure, writing code takes _some_ time, but programmers will eventually build abstractions[^2] on top of the more verbose parts anyway, so
there will be diminishing returns. At best, LLMs as they are today will only replace junior developers, which might cause a software developer
crisis twenty years from now.

I'm afraid the software industry might be stuck in its "build a new coin" moment and forget that the hard parts, like understanding 
complex code architecture and business logic and its effects on existing solutions, or teaching young developers to navigate and understand
a legacy codebase, or help audit security problems across multiple stacks, those and many, many others should be the next goals when it comes to AI.

Personally, I wonder what's the future of strongly-typed programming languages in a world where an AI assistant could automatically infer
the shape of the data and highlight any potential issues. But will we get there by writing `llms.txt` files? 


[^1]: I'd argue that the most exciting prospect for crypto is the use-case of [CBDCs][cbdc] as a digital alternative to cash, but I'd also 
    argue that it's quite telling what's the current state of innovation if the most exciting news might be coming from central banks.

[^2]: So far, I haven't seen any good abstractions coming out of any LLMs

[cbdc]: https://www.edps.europa.eu/press-publications/publications/techsonar/central-bank-digital-currency_en
