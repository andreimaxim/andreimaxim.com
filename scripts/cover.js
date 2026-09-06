#!/usr/bin/env node
// Downloads a book cover from Open Library into src/bookshelf/<slug>/cover.jpg,
// using the ISBN in that book's front matter.
//
//   npm run cover -- neuromancer
//   npm run cover -- tidy-first clean-code
//
// Nothing beyond Node's built-in fetch is needed. If Open Library has no cover
// for the ISBN, the book is skipped and reported; add cover.jpg by hand.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const slugs = process.argv.slice(2);

if (slugs.length === 0) {
  console.error('Usage: npm run cover -- <book-slug> [<book-slug> ...]');
  process.exit(1);
}

let failures = 0;

for (const slug of slugs) {
  const dir = path.join('src', 'bookshelf', slug);
  let frontMatter;

  try {
    frontMatter = await readFile(path.join(dir, 'index.md'), 'utf8');
  } catch {
    console.error(`${slug}: no src/bookshelf/${slug}/index.md`);
    failures++;
    continue;
  }

  const match = frontMatter.match(/^isbn:\s*["']?([\d-]+X?)["']?\s*$/mi);
  if (!match) {
    console.error(`${slug}: no isbn in front matter`);
    failures++;
    continue;
  }

  const isbn = match[1].replace(/-/g, '');
  const response = await fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`);

  if (!response.ok) {
    console.error(`${slug}: Open Library has no cover for ISBN ${isbn} (HTTP ${response.status})`);
    failures++;
    continue;
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(dir, 'cover.jpg'), bytes);
  console.log(`${slug}: saved cover.jpg (${Math.round(bytes.length / 1024)} KB)`);
}

process.exit(failures > 0 ? 1 : 0);
