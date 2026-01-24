---
layout: post
title: Growing tests with LLMs
date: 2026-01-22
description: 
---

I know that most people are talking about using [Ralph loops][ralph] to get LLMs to run autonomously
for long periods of time, but I've never been very interested in that development flow because it
simply generates too much code that is too difficult to review and often you get a lot of
accidental complexity (aka "slop").

[ralph]: https://ghuntley.com/ralph/

What did peak my curiosity was the general idea of _agent invocation with context replay_, meaning
that you run a feed the same prompt to an agent repeatedly in order to perform some work and I
had a very specific reason why.

About eight years ago, I was part of a small team that built a Ruby on Rails JSON API. The main
challenge was the back-and-forth we had to perform with a couple of third-party services in order
to build the correct payload to serve our clients. One of my colleagues spent several weeks
carefully going through every request and response and wrote tests so we can be sure we don't
accidentally break our contracts with the other services. It was a lot of hard work, but it was
great because it provided us a safety net whenever we had to do Rails or Ruby upgrade or
refactor some internals.

The years passed, the service was considered pretty much done software and was working just fine
and we got moved to other internal projects. Whenever something broke, one of us had to quickly fix
the issue and generally it was under pressure. When production is burning, you push a hotfix
and worry about tests later, so it's not hard to imagine that, over the years,
the carefully crafted tests got out of sync and started failing.

However, in the next couple of weeks I'll probably have some bandwidth to fix some of the gnarly
code that accumulated over the years, but right now I have only a handful of working tests and
a total code coverage of less than 14% for roughly 17.000 lines of Ruby code. Surely we can
quickly improve the coverage using an LLM, but how?

I won't be sharing a magic prompt because I don't think it's viable, but instead I'll share my
approach.

I've tried many times to ask an LLM to write tests for existing code and I've generally had
very mixed results and the main reason is kind of surprising: the LLM would often quit before
reaching 100% code coverage. Furthermore, running a test suite 