async function fetchBookDetails(isbn, apiKey) {
  if (!apiKey || apiKey === "YOUR API KEY HERE") {
    console.error("Google Books API key is not configured");
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${apiKey}`,
    );

    if (!response.ok) {
      console.error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
      return null;
    }

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

    console.log("No books found for ISBN:", isbn);
    return null;
  } catch (error) {
    console.error("Error fetching book details:", error);
    return null;
  }
}

export default fetchBookDetails;
