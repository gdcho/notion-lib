import React, { useState } from "react";
import "./App.css";
import fetchBookDetails from "./utils/fetchBookDetails";
import postToNotion from "./utils/postToNotion";

function App() {
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isbn, setIsbn] = useState("");
  const [errorText, setErrorText] = useState("");

  const findBooks = async () => {
    setIsLoading(true); // Start loading
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(["isbns"], async (result) => {
      if (result.isbns) {
        const cleanIsbn = result.isbns[0].replace(/[-\s]/g, "");
        const bookDetails = await fetchBookDetails(cleanIsbn);
        setIsbn(cleanIsbn);
        setBook(bookDetails);
      } else {
        alert("No ISBNs found. Please try again.");
        setErrorText("ERROR: No ISBNs found.");
      }
      setIsLoading(false); // Stop loading
    });
  };

  const handleSaveToNotion = async () => {
    if (book) {
      await postToNotion(
        book,
        process.env.NOTION_TOKEN,
        process.env.NOTION_DATABASE_ID
      );
      alert("Book saved to Notion!");
    }
  };

  const resetBooks = () => {
    setBook(null);
    setIsbn("");
  };

  return (
    <div className="container">
      <h1>Detected Books</h1>
      <button onClick={findBooks}>Find Books</button>
      <button onClick={resetBooks} style={{ marginLeft: "10px" }}>
        Reset Books
      </button>
      {isLoading ? (
        <p>Loading...</p>
      ) : book ? (
        <div style={{ margin: "20px" }}>
          <p>
            <strong>Title:</strong> {book.title}
          </p>
          <p>
            <strong>Author(s):</strong> {book.authors}
          </p>
          <p>
            <strong>ISBN:</strong> {isbn}
          </p>
          {book.imageUrl && (
            <img
              src={book.imageUrl}
              alt={book.title}
              style={{ width: "100px" }}
            />
          )}
          <button onClick={handleSaveToNotion}>Save to Notion</button>
        </div>
      ) : (
        <div>
          {errorText && <p>{errorText}</p>}
          <p>No books found. Click 'Find Books' to search.</p>
        </div>
      )}
    </div>
  );
}

export default App;
