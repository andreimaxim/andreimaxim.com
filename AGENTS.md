# Agent Guidelines for andreimaxim.com

## Build & Development Commands

- Install deps: `npm install` (if the `sharp` post-install script fails, use `npm install --ignore-scripts`; the site does not use it)
- Dev server: `npm start` (localhost:8080 with hot reload)
- Build site: `npm run build` (outputs to `_site/`)
- Fetch a book cover: `npm run cover -- <book-slug>` (Open Library, by the ISBN in the book's front matter)
- No linting/testing commands configured; validate with build success

## Project Structure

- `src/`: Eleventy input (pages, posts, bookshelf, research, feeds, assets, data)
- `src/posts/<slug>/index.md` + `cover.png`: essays (Markdown with Liquid). Front matter: `title`, `date`, `description`, optional `topics: [ruby, testing]`
- `src/bookshelf/<slug>/index.md` + `cover.jpg`: books. All metadata is front matter: `title`, `author`, `year`, `isbn`, `status` (`queued` | `reading` | `finished`), optional `started`, `finished`, `rating` (1–5), `verdict` (one sentence), `description`
- `src/research/<slug>/index.md`: AI-generated notes, reviewed before publishing. Front matter: `title`, `date`, `description`, `topics`, `model`, `tool`, `reviewed`, `updated`, `sources: [{title, url}]`
- `src/pages/`: index pages (`archive`, `bookshelf`, `research`, per-topic research pages, `disclaimer`)
- `src/_includes/layouts/`: `default`, `page`, `post`, `book`, `research`
- `src/_includes/partials/`: `masthead`, `footer`
- `src/_data/site.js`: site title, description, base URL
- `src/assets/css/main.css`: the whole stylesheet; `prism.css` for code highlighting
- `scripts/cover.js`: cover downloader
- `eleventy.config.js`: collections (`postsByYear`, `booksByStatus`, `shelf`, `researchTopics`, `latest`) and filters
- `_site/`: build output (never commit)

## How the pages work

- Every page is one grid: a margin column (`.mg`) for labels, dates, covers and provenance, and a text column (`.tx`) at reading width. The page is exactly as wide as the two columns.
- The home page leads with the newest entry across posts, research notes and books (books count once they have `started` or `finished`; queued books never lead), then lists Writing, the Bookshelf (a row of covers) and Research.
- Topics are shared between posts and research notes; matching items appear under "See also" on each other's pages.
- Sidenotes: in any Markdown file, put a note in the margin beside the paragraph that follows it with a paired shortcode on its own lines. Markdown works inside. Leave a paragraph or two between notes so they do not overlap; on narrow screens the note becomes a small block before its paragraph.

  ```liquid
  {% sidenote %}
  Ousterhout's term, from *A Philosophy of Software Design*, chapter 4.
  {% endsidenote %}

  I understand the general criticism that ...
  ```

## Design rules (keep them when adding anything)

- One accent colour, the green. Emphasis is size or weight, never a second colour.
- Body text stays at the text column width; extra screen width goes to the margins.
- Type sizes are the five tokens in `main.css`; essays use `##` and `###` only, the layout owns the h1.
- Spacing uses the `--space-*` scale. Colours are tokens with light and dark values; never write a hex in a component.
- Book covers are 600×900 JPEG, post covers 1200×630 PNG.
- A border, box or shadow means "a separate thing". If it is not, do not draw one.
