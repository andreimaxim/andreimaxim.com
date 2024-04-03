/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_drafts/**/*.md',
    './_includes/**/*.liquid',
    './_layouts/**/*.liquid',
    './_posts/**/*.md',
    './*.html'
    ],
  plugins: [
    require('@tailwindcss/typography')
  ]
}
