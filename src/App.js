import React, { useState } from "react";
import "./App.css";
import fetchBookDetails from "./utils/fetchBookDetails";
import postToNotion from "./utils/postToNotion";

function App() {
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isbn, setIsbn] = useState("");
  const [errorText, setErrorText] = useState("");
  const [testMessage, setTestMessage] = useState("");

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
      setIsLoading(false);
    });
  };

  const handleSaveToNotion = async () => {
    if (book) {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await postToNotion(
          book,
          process.env.REACT_APP_NOTION_TOKEN,
          process.env.REACT_NOTION_DATABASE_ID
        );
        alert("Book saved to Notion!");
      } catch (error) {
        console.error("Failed to save book to Notion:", error);
        alert(`Failed to save book to Notion: ${error.message}`);
      }
    } else {
      alert("No book to save. Please find a book first.");
    }
  };

  const resetBooks = () => {
    setBook(null);
    setIsbn("");
  };

  const testNotionConnection = async () => {
    const notionToken = process.env.NOTION_TOKEN;
    fetch("https://api.notion.com/v1/{databaseID}/query", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2021-08-16",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTestMessage("Connection test successful!");
      })
      .catch((error) => {
        console.error("Error:", error);
        setTestMessage(`Connection test failed: ${error.message}`);
      });
  };

  return (
    <div className="container">
      <h1>Detected Books</h1>
      <p>
        Go to{" "}
        <a href="https://books.google.com/" target="_blank" rel="noreferrer">
          https://books.google.com/
        </a>{" "}
        to search for books
      </p>
      <button onClick={findBooks}>Find Books</button>
      <button onClick={resetBooks} style={{ marginLeft: "10px" }}>
        Reset Books
      </button>
      <button onClick={testNotionConnection} style={{ marginLeft: "10px" }}>
        Test Notion Connection
      </button>
      {isLoading ? (
        <p>Loading...</p>
      ) : book ? (
        <div style={{ margin: "20px" }}>
          {testMessage && <p>{testMessage}</p>}
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
