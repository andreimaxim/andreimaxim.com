# Agent Guidelines for andreimaxim.com

## Build & Development Commands

- Install deps: `npm install`
- Dev server: `npm start` (localhost:8080 with hot reload)
- Build site: `npm run build` (outputs to `_site/`)
- Deploy: `npx wrangler deploy --env production` (Cloudflare Workers)
- No linting/testing commands configured; validate with build success

## Code Style & Conventions

- **JavaScript**: 2 spaces, single quotes, prefer ESM (`import`/`export`)
- **Files**: kebab-case naming (e.g., `my-component.js`)
- **Liquid templates**: use `{%- -%}` for whitespace control
- **Markdown posts**: `YYYY-MM-DD-slug.md` format with `title`, `description` frontmatter
- **HTML**: semantic tags, proper heading hierarchy, always include alt text
- **CSS**: optimize for performance, use existing `src/assets/css/main.css` patterns
- **Error handling**: graceful fallbacks in templates, validate dates/permalinks

## Project Structure

- `src/`: Eleventy input (pages, posts, feeds, assets, data)
- `src/posts/`: Blog posts (Markdown with Liquid)
- `src/_includes/`: Liquid templates (`layouts/` and `partials/`)
- `src/_data/`: Global data
- `src/assets/`: Static files (CSS, JS, images)
- `eleventy.config.js`: Site configuration
- `_site/`: Build output (never commit)
