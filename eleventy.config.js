import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);

  eleventyConfig.addPlugin(feedPlugin, {
    type: 'atom',
    outputPath: '/feed.xml',
    stylesheet: 'feeds/pretty-atom-feed.xsl',
    templateData: {
      search: 'exclude'
    },
    collection: {
      name: 'posts',
      limit: 20
    },
    metadata: {
      language: 'en',
      title: "Andrei Maxim",
      subtitle: 'Andrei Maxim\'s digital garden with writings about Ruby, Rails, HTML, CSS and JavaScript.',
      base: "https://andreimaxim.com",
      author: {
        name: 'Andrei Maxim'
      }
    }
  });

  eleventyConfig.addPassthroughCopy({
    'src/assets': 'assets',
    'src/feeds/pretty-atom-feed.xsl': 'feeds/pretty-atom-feed.xsl'
  });

  eleventyConfig.addCollection('postsByYear', function (collectionApi) {
    const groups = new Map();
    collectionApi.getFilteredByGlob('src/posts/*.md').reverse().forEach(post => {
      const year = new Date(post.date).getFullYear().toString();
      groups.set(year, [...(groups.get(year) || []), post]);
    });
    return Array.from(groups.entries())
      .sort(([a], [b]) => Number(b[0]) - Number(a[0]))
      .map(([name, items]) => ({ name, items }));
  });

  eleventyConfig.addFilter('dateIso', date => date.toISOString().split('T')[0]);

  eleventyConfig.addFilter('dateReadable', date => date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));

  eleventyConfig.addWatchTarget('src/assets/css/');

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      layouts: '_includes/layouts',
      data: '_data',
      output: '_site'
    },
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    templateFormats: ['md', 'njk', 'html']
  };
}
