/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './_drafts/**/*.md',
        './_includes/**/*.liquid',
        './_layouts/**/*.liquid',
        './_posts/**/*.md',
        './*.md'
    ],
    theme: {
        extend: {
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: "80ch"
                    }
                }
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography')
    ],
}
