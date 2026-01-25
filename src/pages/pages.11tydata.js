export default {
    layout: "page.liquid",
    tags: ["pages"],
    eleventyComputed: {
        readBooks: data => data.books.filter(book => book.status === 'read')
    }
};
