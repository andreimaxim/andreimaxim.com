import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

// A book's "date" for sorting and for the home page lead: when it was finished,
// otherwise when it was started, otherwise the file date Eleventy assigned.
const entryDate = item => item.data.finished || item.data.started || item.date;
const byNewest = (a, b) => entryDate(b) - entryDate(a);

const groupBy = (items, keyOf) => {
  const groups = new Map();
  for (const item of items) {
    for (const key of [].concat(keyOf(item) ?? [])) {
      groups.set(key, [...(groups.get(key) || []), item]);
    }
  }
  return groups;
};

const STATUS_ORDER = ['reading', 'finished', 'queued'];

const dateFormat = (options, locale = 'en-GB') => date =>
  new Date(date).toLocaleDateString(locale, { timeZone: 'UTC', ...options });

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy({
    'src/assets': 'assets',
    'src/feeds/pretty-atom-feed.xsl': 'feeds/pretty-atom-feed.xsl'
  });
  eleventyConfig.addPassthroughCopy('src/bookshelf/**/*.jpg');
  eleventyConfig.addPassthroughCopy('src/posts/**/*.png');
  eleventyConfig.addPassthroughCopy('src/research/**/*.{png,jpg,svg}');

  // ---- Collections ---------------------------------------------------------

  eleventyConfig.addCollection('postsByYear', api => {
    const groups = groupBy(api.getFilteredByTag('posts').reverse(), post => String(post.date.getFullYear()));
    return [...groups.entries()]
      .sort(([a], [b]) => Number(b) - Number(a))
      .map(([name, items]) => ({ name, items }));
  });

  // Books grouped by status, in the order they matter: reading, finished, queued.
  eleventyConfig.addCollection('booksByStatus', api => {
    const groups = groupBy(api.getFilteredByTag('books'), book => book.data.status || 'queued');
    return STATUS_ORDER
      .filter(status => groups.has(status))
      .map(status => ({ name: status, items: groups.get(status).sort(byNewest) }));
  });

  // The same books, flat, for the row of covers on the home page.
  eleventyConfig.addCollection('shelf', api => {
    const books = api.getFilteredByTag('books');
    const rank = book => STATUS_ORDER.indexOf(book.data.status || 'queued');
    return books.sort((a, b) => rank(a) - rank(b) || byNewest(a, b));
  });

  eleventyConfig.addCollection('researchTopics', api => {
    const groups = groupBy(api.getFilteredByTag('research'), note => note.data.topics);
    return [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, items]) => ({ name, items: items.sort(byNewest) }));
  });

  // Everything that can open the home page, newest first. Queued books and books
  // without a started/finished date never lead; nothing has happened to them yet.
  eleventyConfig.addCollection('latest', api => {
    const books = api.getFilteredByTag('books')
      .filter(book => book.data.status !== 'queued' && (book.data.started || book.data.finished));
    return [...api.getFilteredByTag('posts'), ...api.getFilteredByTag('research'), ...books].sort(byNewest);
  });

  // ---- Filters -------------------------------------------------------------

  eleventyConfig.addFilter('dateIso', date => new Date(date).toISOString().split('T')[0]);
  eleventyConfig.addFilter('dateReadable', dateFormat({ year: 'numeric', month: 'long', day: 'numeric' }));
  eleventyConfig.addFilter('dateShort', dateFormat({ year: 'numeric', month: 'short', day: 'numeric' }));
  eleventyConfig.addFilter('dateMonth', dateFormat({ year: 'numeric', month: 'long' }));

  eleventyConfig.addFilter('entryDate', entryDate);

  // "essay" | "book" | "note", from the collection an item belongs to.
  eleventyConfig.addFilter('kind', item => {
    const tags = item?.data?.tags || [];
    if (tags.includes('posts')) return 'essay';
    if (tags.includes('books')) return 'book';
    if (tags.includes('research')) return 'note';
    return 'page';
  });

  // Collections with no items do not exist at all, so `items` may be undefined.
  eleventyConfig.addFilter('without', (items, item) => (items || []).filter(i => i.url !== item?.url));

  // Items sharing at least one topic with the given list, newest first.
  eleventyConfig.addFilter('related', (items, topics, limit = 3) => {
    if (!Array.isArray(topics) || topics.length === 0) return [];
    return (items || [])
      .filter(item => (item.data.topics || []).some(topic => topics.includes(topic)))
      .sort(byNewest)
      .slice(0, limit);
  });

  eleventyConfig.addFilter('stars', rating => {
    const n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  });

  eleventyConfig.addFilter('words', html => {
    const count = String(html || '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    return `${count.toLocaleString('en-US')} words`;
  });

  // ---- Shortcodes ----------------------------------------------------------

  // A note in the margin, beside the paragraph that follows it. Use it in any
  // Markdown file, on its own lines, right before the paragraph it belongs to:
  //
  //   {% sidenote %}
  //   Ousterhout's term. See *A Philosophy of Software Design*, chapter 4.
  //   {% endsidenote %}
  //
  // The blank lines around the content let Markdown render what is inside.
  // Notes that are close together overlap, so leave a paragraph or two between them.
  eleventyConfig.addPairedShortcode('sidenote', content =>
    `<aside class="sidenote">\n\n${content.trim()}\n\n</aside>`);

  eleventyConfig.addWatchTarget('src/assets/css/');

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      layouts: '_includes/layouts',
      data: '_data',
      output: '_site'
    },
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'liquid',
    templateFormats: ['md', 'liquid', 'html']
  };
}
