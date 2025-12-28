# Agent Guidelines for andreimaxim.com

## Build & Development Commands

- Install deps: `npm install`
- Dev server: `npm start` (localhost:8080 with hot reload)
- Build site: `npm run build` (outputs to `_site/`)
- No linting/testing commands configured; validate with build success

## Project Structure

- `src/`: Eleventy input (pages, posts, feeds, assets, data)
- `src/posts/`: Blog posts (Markdown with Liquid)
- `src/_includes/`: Liquid templates (`layouts/` and `partials/`)
- `src/_data/`: Global data
- `src/assets/`: Static files (CSS, JS, images)
- `eleventy.config.js`: Site configuration
- `_site/`: Build output (never commit)
