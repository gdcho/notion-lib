// src/utils/fetchBookDetails.js

const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

async function fetchBookDetails(isbn) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${GOOGLE_BOOKS_API_KEY}`,
        );
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            const book = data.items[0].volumeInfo;
            return {
                title: book.title,
                authors: book.authors ? book.authors.join(", ") : "No author",
                imageUrl: book.imageLinks ? book.imageLinks.thumbnail : "",
                totalPages: book.pageCount || 0,
                link: book.infoLink,
                summary: book.description || "No description",
            };
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export default fetchBookDetails;
