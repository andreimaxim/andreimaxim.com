// Every src/research/<slug>/index.md is a research note, generated with a model
// and reviewed before publishing. Front matter:
//
//   title, date, description          as for posts
//   updated                           date of the last revision, optional
//   topics: [ruby, testing]           same vocabulary as posts; drives topic pages and "See also"
//   model: claude-opus-5              the model that produced the note
//   tool: Claude Code                 where it ran, optional
//   reviewed: true                    set once you have read and checked it
//   sources:                          what the note was checked against
//     - title: simplecov README, "Merging results"
//       url: https://github.com/simplecov-ruby/simplecov
export default {
  layout: "research.liquid",
  tags: ["research"]
};
