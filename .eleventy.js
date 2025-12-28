import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  // Copy assets to output
  eleventyConfig.addPassthroughCopy('assets');

  // Set up collections
  eleventyConfig.addCollection('posts', function (collectionApi) {
    return collectionApi.getFilteredByGlob('posts/*.md').reverse();
  });

  eleventyConfig.addCollection('postsByYear', function (collectionApi) {
    const groups = new Map();
    const posts = collectionApi.getFilteredByGlob('posts/*.md').reverse();

    posts.forEach(post => {
      const year = new Date(post.date).getFullYear().toString();
      if (!groups.has(year)) {
        groups.set(year, { name: year, items: [] });
      }
      groups.get(year).items.push(post);
    });

    return Array.from(groups.values()).sort((a, b) => Number(b.name) - Number(a.name));
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
