# Agent Guidelines for andreimaxim.com

## Build & Development Commands

- Install deps: `npm install`
- Dev server: `npm start` (localhost:8080 with hot reload)
- Build site: `npm run build` (outputs to `_site/`)
- Deploy: `npx wrangler deploy --env production` (Cloudflare Workers)
- No linting/testing commands configured; validate with build success

## Code Style & Conventions

- **JavaScript**: 2 spaces, single quotes, CommonJS modules (no ES6 imports)
- **Files**: kebab-case naming (e.g., `my-component.js`)
- **Liquid templates**: use `{%- -%}` for whitespace control
- **Markdown posts**: `YYYY-MM-DD-slug.md` format with `title`, `description` frontmatter
- **HTML**: semantic tags, proper heading hierarchy, always include alt text
- **CSS**: optimize for performance, use existing `assets/css/main.css` patterns
- **Error handling**: graceful fallbacks in templates, validate dates/permalinks

## Project Structure

- `posts/`: Blog posts (Markdown with Liquid)
- `_layouts/`, `_includes/`: Liquid templates
- `assets/`: Static files (CSS, JS, images)
- `.eleventy.js`: Site configuration
- `_site/`: Build output (never commit)
