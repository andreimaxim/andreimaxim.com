---
layout: post
title: How I use AI for Programming
---
I've been using LLMs since March 2023, when ChatGPT 4 was released and it became clear (at least for me)
that AI will probably have a significant impact in my job as a programmer. I've used it almost daily
and I certainly found it useful, but also that there are some limitations that I'd need to overcome
in order to truly increase my productivity.

First of all, let's talk about the two elephants in the room.

### The impact of AI on learning

I've started as a .NET developer and one of the features that set Visual Studio apart was its IntelliSense,
which worked pretty much the same as a modern LSP server and client implementation: it had code completion,
parameter information, go to definition, and so on.

IntelliSense was a big deal. 

For example, Charles Petzold, the author of the bible you had to read if you wanted to develop Windows applications, 
wrote in his article from 2005 called ["Does Visual Studio Rot the Mind"][vs-rot-mind] (foreshadowing):

> IntelliSense is considered by some to be the most important programming innovation since caffeine. 
> It works especially well with .NET because Visual Studio can use reflection to obtain all the information
> it needs from the actual DLLs you’ve specified as references.
> 
> In fact, IntelliSense has become the first warning sign that you haven’t properly included a DLL reference
> or a using directive at the top of your code. You start typing and IntelliSense comes up with nothing.
> You know immediately something is wrong.

[vs-rot-mind]: https://web.archive.org/web/20250428204538/https://charlespetzold.com/etc/DoesVisualStudioRotTheMind.html

Back in 2005 I was just a junior developer and I was fortunate enough to get a job at a small company where the senior
developers would spend some time with junior developers to show how they work, why they write code like that, and
what are some common pitfalls they've noticed. Basically a mentorship program.

I remember to this day the pair programming sessions where my mentor would extremely frequently hit the spacebar,
taking advantage of the IntelliSense feature, ripping through code too quickly for me to understand what was
going on. I was much slower and I had to open the official documentation (called MSDN) or open the class or method
I was calling in order to figure out what was going on, but I'd slowly pick things up and end up relying on
IntelliSense more and more.

However, Charles Petzold's article continues:

> And yet, IntelliSense is also dictating the way we program.
> 
> For example, for many years programmers have debated whether it’s best to code in a top-down manner, where
> you basically start with the overall structure of the program and then eventually code the more detailed
> routines at the bottom; or, alternatively, the bottom-up approach, where you start with the low-level functions
> and then proceed upwards. Some languages, such as classical Pascal, basically impose a bottom-up approach,
> but other languages do not.
> 
> Well, the debate is now over. In order to get IntelliSense to work correctly, bottom-up programming is best.
> IntelliSense wants every class, every method, every property, every field, every method parameter, every local
> variable properly defined before you refer to it. If that’s not the case, then IntelliSense will try to correct
> what you’re typing by using something that has been defined, and which is probably just plain wrong.
> 
> For example, suppose you’re typing some code and you decide you need a variable named `id`, and instead of defining
> it first, you start typing a statement that begins with id and a space. I always type a space between my variable
> and the equals sign. Because id is not defined anywhere, IntelliSense will find something that begins with those
> two letters that is syntactically correct in accordance with the references, namespaces, and context of your code.
> In my particular case, IntelliSense decided that I really wanted to define a variable of interface type 
> `IDataGridColumnStyleEditingNotificationService`, an interface I’ve never had occasion to use.
> 
> On the plus side, if you really need to define an object of type `IDataGridColumnStyleEditingNotificationService`, 
> all you need do is type id and a space.
>
> If that’s wrong, you can eliminate IntelliSense’s proposed code and go back to what you originally typed with the Undo
> key combination Ctrl-Z. I wish I could slap its hand and say “No,” but Ctrl-Z is the only thing that works. Who could
> ever have guess that Ctrl-Z would become one of the most important keystrokes in using modern Windows applications?
> Ctrl-Z works in Microsoft Word as well, when Word is overly aggressive about fixing your typing.
>
> But the implication here is staggering. To get IntelliSense to work right, not only must you code in a bottom-up structure,
> but within each method or property, you must also write you code linearly from beginning to end — just as if you were
> using that old DOS line editor, EDLIN. You must define all variables before you use them. No more skipping around in your
> code.
>
> It’s not that IntelliSense is teaching us to program like a machine; it’s just that IntelliSense would be much happier
> if we did.
> 
> And I think it’s making us dumber. Instead of finding out exactly the method I need, or instead of trying to remember
> an elusive property name, I find myself scrolling through the possibilities that IntelliSense provides, looking for a
> familiar name, or at least something that seems like it might do the job.

I was a college student back then, so I didn't think too much about the last paragraph. I just needed to write code
quickly!

A year later I decided to switch to Ruby and Ruby on Rails. Back then, there was no IntelliSense, even debugging
was quite convoluted so you'd end up relying a lot either on `puts` debugging, or running code in the REPL.

However, I picked up Ruby and Ruby on Rails much faster than .NET because of the way you'd learn Rails back then was
to follow the [Agile Web Development with Rails][awdwr] book and manually type the code in your editor, run the code, see
it work or failing, fix it, then move on to the next code snippet and so on.

[awdwr]: https://pragprog.com/titles/rails8/agile-web-development-with-rails-8/

Many years later, when LSPs became popular and then Github Copilot became available, I remembered Charles Petzold's 
article and, even to this day, I disable autocompletion of any kind (I have a keyboard shortcut for on-demand
autocompletion, but it's normally turned off by default). I like the code navigation tools, because they are much faster 
than grepping through code, but I've always found that autocompletion is not only very distracting, but it also enables
me to make a lesser effort when it comes to properly naming methods or classes.

AI tools are much more powerful than LSPs and, as such, I'm trying to be as careful as possible when using them because
the medium or long-term side-effects on our brains from using such tools is unknown and there already is evidence of
some effect like the [Copilot Pause][copilot-pause].

[copilot-pause]: https://thomasvogelaar.me/posts/the-copilot-pause/


### Code Ownership

I am paid by my employer to write code and there are a couple of fundamental issues when working with AI tools.

First of all, I don't think there's an issue if the code I submit in the repository was generated by an AI. We've
been using tools that generate code for many years now, from IDEs to Rails generators. However, it is my
responsibility to have an idea what every single line of code I submit is doing because I'll be the one that
will probably need to fix the bugs. I can't just "vibe code."

Also, showing up to a code review with a piece of code you don't understand and can't explain because an LLM
wrote it for you is a quick way to get fired, regardless of how much some CEOs might be pushing the narrative
of AI-first programming.

The second problem is about code sharing. Most AI tools have a checkbox that says "I want to share my data with
the tool's company," but once I submit the code to the repository, the code is no longer mine, it's my employer's.
Which means that I can't use AI agents on a codebase I don't own without the employer's explicit permission because
I can't rely on that checkbox properly working, nor can I verify that the tool isn't storing the code it's
processing.

---

Now with all this out of the way, let me explain how I use AI tools as a professional programmer.


### When working with a brittle legacy codebase

First, there's the case where I need to make a change on a piece of existing code in a legacy codebase.
This is generally my day to day job and the only approved AI tool is Github Copilot with the OpenAI or Anthropic
models enabled.

I've tried using Copilot in agent mode, but unfortunately it's a 11-year old codebase with few automated tests, so
I need to be very careful what I change and where since I don't have the safety net of automated tests. Even for new
functionality, I'd need to spend a lot of time to explain the non-standard layout of the codebase to agents, which
will most likely hit the limit of their context window very quickly, so I generally implement most of the things 
by hand.

In this scenario, I might use Copilot Chat to validate some ideas, but this happens rarely.

What does work quite nicely is to use the LLM for very discrete tasks. For example, if you're building a JSON
API, you pass a JSON blob to the LLM and ask it to generate test data based on some specific scenarios. It's
really fast, quite accurate, and the review cost is very small, so low risk while the benefits of having
good test data in a brittle codebase are really, really high.

I've actually cracked open [Michael Feather's "Working Effectively with Legacy Code"][wewlc] for a refresher
to figure out ways to improve the codebase, since a lot of the techniques described in the book could
be implemented faster using AI.

[wewlc]: https://www.amazon.com/Working-Effectively-Legacy-Michael-Feathers/dp/0131177052


### When working with a well-organized codebase

I've noticed that good programming practices enable you to use more advanced AI tools, like agents:
* Automated tests can catch any regressions caused by agents editing your code
* Well-encapsulated code limits the amount of context agents need to have
* Single Responsibility Principle limits the surface area the agents need to change

... and so on because they help you feed the AI tool the *right* context and, at least when it comes to code,
everything matters: class names, method names, comments, namespace names, package names, etc.

I've noticed that the more meaning you can cram into the context window with less tokens, the better and, 
incidentally, this also applies to humans. This is why we have design patterns, for example, because
once a human or an AI tool sees the word "singleton" they know exactly what it means without requiring
any more context. The same applies for well-defined domain models.

However, the AI will still need a bit of hand-holding, so I do two things:
* I create an `AGENT.md` (I use Amp Code, but there's a `CLAUDE.md` for Claude Code or `AGENTS.md` for OpenAI Codex)
  to set up general project rules
* I write long threads in the chat, where I try to explain as well as I can what I want to achieve, what I think might
  need to be changed, what might be the potential issues and so on

Here's a sample `AGENT.md` I created for a Redmine project I'm working on:

```markdown
# Agent Guidelines for project_name

## About this project
- This is a plugin for Redmine, an issue management system built using Ruby on Rails.
- It <define the purpose of the project>
- The plugin needs to be compatible with Redmine 5.0 and newer.

## Build/Test Commands
- **Run all tests**: `../../bin/rails test redmine:plugins:test NAME=plugin_name`
- **Run specific test**: `../../bin/rails test plugins/plugin_name/test/unit/path/to/test.rb:LINE_NUMBER`
- **Run specific test file**: `../../bin/rails test plugins/plugin_name/test/unit/path/to/test.rb`
- **Code lint**: `bundle exec rubocop` (uses rubocop-rails-omakase)
- **Auto-fix linting issues**: `bundle exec rubocop -a`

## Development flow
- Extract a set of scenarios from the conversation, ask for confirmation and then encode them into tests
- Run the tests to see which tests fail
- Unless, the code already exists, write only the minimum amount of code that allows the failing tests
- Look for code smells, point them out and ask for confirmation before refactor the code
- Ensure the tests keep passing

## Code Style Guidelines
- **Style**: Follow Rails Omakase styling via rubocop-rails-omakase
- **Naming**: snake_case for variables/methods, CamelCase for classes/modules, ALL_CAPS for constants
- **String literals**: Use double quotes for strings
- **Arrays**: Use square brackets with spaces `[ "item1", "item2" ]`
- **Hash syntax**: Use modern hash syntax `{ key: value }` for symbol keys
- **Private methods**: Indent private methods with 2 spaces from class definition
- **Error handling**: Use rescue blocks for specific exceptions, log errors with Rails.logger.error
- **Security**: Use `ActiveSupport::SecurityUtils.secure_compare` for sensitive comparisons
- **Params**: Use keyword arguments for methods with multiple parameters
- **HTTP requests**: Use Net::HTTP with explicit SSL and proper error handling
- **JSON parsing**: Always rescue JSON::ParserError and handle gracefully
- Aim to write concise, yet expressive and idiomatic Ruby code
- Use the classes and helpers available in Rails, if appropriate
- Define class methods inside `class << self; end` declarations.

## Testing
- Use the default Rails testing framework when writing tests
- Each test case is a scenario and should be named as such
- Don't ever test private methods directly. Specs should test behavior, not implementation.

## Guidance and Expectations
- The names of variables, methods or classes should be as descriptive as possible
- Do not decide unilaterally to leave code for the sake of "backwards compatibility"... always run 
  those decisions by me first.
- Extract discrete pieces of logic into methods
```

I'm still tweaking parts of it to see how this influences the output, so please don't consider it a final solution in any way.
It's based on what Amp Code generates automatically and it's inspired quite a lot from [Obie Fernandez's CLAUDE.md][claude-md].

[claude-md]: https://github.com/Shopify/roast/blob/main/CLAUDE.md

You'll note there's no "Product Requirements Document" or something similar. The `AGENT.md` is very similar to a coding guidelines
document you'd give a junior developer that's onboarding the project or what you might say during a code review. I don't think
PRDs are necessary because I want to work on a small task at a time so I can review the output quickly and integrate it into
the existing codebase, so most of the requirements I'll share in a chat thread.

I found that writing a rather long message in the chat actually also helps me understand the problem a bit better because now
I have to explain it to the LLM and it's also useful when switching context since I can read the chat messages and see
what I was thinking of.

For example, when implementing an import feature for a hypothetical CMS engine, I'd probably start with a message like this:

> The current goal is to process the files in the test/fixtures/files/legacy/ folder. The folder has a "overview.json" file that
> acts as some sort of index, meaning it has a list of accounts and each account should have an associated JSON file named as 
> \<account_id\>.json, which contains all the blog posts of that user.
>
> The posts should be ingestible using the Post model, but we need to figure out a good name for a domain model to process the
> "index" file, then open the account files and then build an array of Post objects.
>
> Let's brainstorm for good domain model names that are descriptive for the task at hand.

Once I have the domain models mapped out, I will start a new chat for each specific domain model. From my experience,
it's much better to do TDD (yet another case of an older practice that works great in the age of AI) and start with one
test case, implement that scenario, then move on.

I think it's important to work on a single test case at a time, even though you can feed the AI a number of test cases,
because you can see the code grow and you can evaluate how it evolves. Does the method really need all these parameters?
Is there too much ceremony? Is one object reaching into the internals of a different object, breaking encapsulation?
Don't forget that LLMs often act as a median for all the code they had access to and it's up to you to make the right
choices so it's more than just "average code".

Another approach I've used was to build the models I knew for sure I needed and then tell the agent to write a script
that performs the task I wanted to build. Obviously, the result would be a huge chunk of procedural code with multiple
`if`s and `for`s and `while`s within each other, but it allowed me to look for patterns that I might have missed or
misunderstood.

### When working with greenfield projects

Building an MVP is definitely faster with an AI tool nowadays and there's a solid argument in favor of building a
throwaway prototype quickly using AI, but I'm not sure I agree. I've tested this approach a couple of times and
I can't say I feel I learned something valuable from the point of view of a developer (see the long intro), but I think
I can see the value of this approach for a project manager or founder.

I've also seen people use LLMs to build a React frontend for their backend. I found out that this approach works fine
initially, but beyond a certain point the error messages will no longer make sense for me and I'd rely exclusively on
the AI to figure things out (and it sometimes does!), but based on my experience with backend code, I think I'd
rather have a much simpler UI that I can understand and change, then introduce complexity just because I can.

However, do keep in mind that I'm speaking as a developer hired to build features. For an indie developer or a founder,
things might be different.