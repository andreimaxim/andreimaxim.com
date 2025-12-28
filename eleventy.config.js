import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });

  eleventyConfig.addCollection('posts', function (collectionApi) {
    return collectionApi.getFilteredByTag('posts').reverse();
  });

  eleventyConfig.addCollection('postsByYear', function (collectionApi) {
    const groups = new Map();
    const posts = collectionApi.getFilteredByTag('posts').reverse();

    posts.forEach(post => {
      const year = new Date(post.date).getFullYear().toString();
      if (!groups.has(year)) {
        groups.set(year, { name: year, items: [] });
      }
      groups.get(year).items.push(post);
    });

    return Array.from(groups.values()).sort((a, b) => Number(b.name) - Number(a.name));
  });

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
    templateFormats: ['html', 'liquid', 'md']
  };
}
