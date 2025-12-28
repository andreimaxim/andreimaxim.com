export default {
  layout: 'post',
  tags: ['posts'],
  eleventyComputed: {
    permalink: data => {
      if (!data.page?.fileSlug) return data.permalink;
      return `/posts/${data.page.fileSlug}/`;
    }
  }
};
