// src/utils/fetchBookDetails.js
async function fetchBookDetails(isbn) {
  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const book = data.items[0].volumeInfo;
      return {
        title: book.title,
        authors: book.authors ? book.authors.join(", ") : "No author",
        imageUrl: book.imageLinks ? book.imageLinks.thumbnail : "",
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
