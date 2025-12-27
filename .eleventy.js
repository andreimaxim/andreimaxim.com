import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  // Copy assets to output
  eleventyConfig.addPassthroughCopy('assets');

  // Copy specific files
  eleventyConfig.addPassthroughCopy('feed.xml');
  eleventyConfig.addPassthroughCopy('sitemap.xml');

  // Set up collections
  eleventyConfig.addCollection('posts', function (collectionApi) {
    return collectionApi.getFilteredByGlob('posts/*.md').reverse();
  });

  // Parse dates from filenames for Jekyll-style posts
  eleventyConfig.addGlobalData('eleventyComputed', {
    date: function (data) {
      if (data.page.inputPath.includes('posts/')) {
        const filename = data.page.inputPath.split('/').pop();
        const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})-/);
        if (dateMatch) {
          return new Date(dateMatch[1]);
        }
      }
      return data.date;
    }
  });

  // Transform permalinks for posts
  eleventyConfig.addFilter('postPermalink', function (inputPath) {
    if (inputPath.includes('posts/')) {
      const filename = inputPath.split('/').pop();
      const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      return `/posts/${slug}/`;
    }
    return inputPath;
  });

  // Date filter
  eleventyConfig.addFilter('date', function (date, format) {
    const d = new Date(date);
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];

    if (format === '%B %e, %Y') {
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
    return d.toISOString().split('T')[0];
  });

  // Add base URL for canonical and social meta tags
  eleventyConfig.addGlobalData('baseUrl', function () {
    return process.env.NODE_ENV === 'production' ? 'https://andreimaxim.com' : 'http://localhost:8080';
  });

  return {
    dir: {
      input: '.',
      includes: '_includes',
      layouts: '_layouts',
      output: '_site'
    },
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'liquid',
    templateFormats: ['html', 'liquid', 'md']
  };
}
