const path = require('node:path');

function getFilename(inputPath) {
  return path.basename(inputPath);
}

function getPostDateFromFilename(filename) {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-/);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) return null;
  return new Date(year, month - 1, day);
}

function getPostSlugFromFilename(filename) {
  return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

module.exports = {
  layout: 'post',
  eleventyComputed: {
    date: data => {
      if (!data.page?.inputPath) return data.date;
      const filename = getFilename(data.page.inputPath);
      return getPostDateFromFilename(filename) ?? data.date;
    },
    permalink: data => {
      if (!data.page?.inputPath) return data.permalink;
      const filename = getFilename(data.page.inputPath);
      const slug = getPostSlugFromFilename(filename);
      return `/posts/${slug}/`;
    }
  }
};
