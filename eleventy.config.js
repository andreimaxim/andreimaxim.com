import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import { feedPlugin } from '@11ty/eleventy-plugin-rss';

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight)

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
  })

  eleventyConfig.addPassthroughCopy({
    'src/assets': 'assets',
    'src/feeds/pretty-atom-feed.xsl': 'feeds/pretty-atom-feed.xsl'
  })

  eleventyConfig.addCollection('posts', function (collectionApi) {
    return collectionApi.getFilteredByTag('posts');
  })

  eleventyConfig.addCollection('postsByYear', function (collectionApi) {
    const groups = new Map();
    const posts = collectionApi.getFilteredByTag('posts').reverse();

    posts.forEach(post => {
      const year = new Date(post.date).getFullYear().toString();
      if (!groups.has(year)) {
        groups.set(year, { name: year, items: [] });
      }
      groups.get(year).items.push(post);
    })

    return Array.from(groups.values()).sort((a, b) => Number(b.name) - Number(a.name));
  })

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
    templateFormats: ['html', 'liquid', 'md', 'njk']
  };
}
