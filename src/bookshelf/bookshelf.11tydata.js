// Every src/bookshelf/<slug>/index.md is a book. All of its metadata lives in
// its front matter: title, author, year, isbn, status (queued | reading | finished),
// started, finished, rating (1–5), verdict (one sentence), description (standfirst).
// The cover is src/bookshelf/<slug>/cover.jpg; fetch it with `npm run cover -- <slug>`.
export default {
  layout: "book.liquid",
  tags: ["books"]
};
