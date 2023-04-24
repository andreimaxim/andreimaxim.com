/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './_drafts/**/*.md',
        './_includes/**/*.liquid',
        './_layouts/**/*.liquid',
        './_posts/**/*.md',
        './*.html'
    ],
    theme: {
        fontFamily: {
            sans: [
                'Inter',
                'ui-sans-serif',
                'system-ui',
                '-apple-system',
                'BlinkMacSystemFont',
                'Segoe UI',
                'Roboto',
                'Helvetica Neue',
                'Arial',
                'Noto Sans',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',
                'Segoe UI Symbol',
                'Noto Color Emoji'
            ],
            bold: [
                'Inter'
            ],
            italic: [
                'Inter'
            ]
        },
        extend: {},
    },
    plugins: [
        require('@tailwindcss/typography')
    ],
}
