import React, { useState } from "react";
import "./App.css";
import fetchBookDetails from "./utils/fetchBookDetails";
import postToNotion from "./utils/postToNotion";
import Button from "./components/Button";
import Lottie from "react-lottie";
import animation from "./lottie/book.json";

function App() {
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isbn, setIsbn] = useState("");
  const [errorText, setErrorText] = useState("");
  const [reset, setReset] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const findBooks = async () => {
    setIsLoading(true);
    setReset(true);
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(["isbns"], async (result) => {
      if (result.isbns) {
        const cleanIsbn = result.isbns[0].replace(/[-\s]/g, "");
        const bookDetails = await fetchBookDetails(cleanIsbn);
        setIsbn(cleanIsbn);
        setBook(bookDetails);
      } else {
        setErrorText("ERROR: No ISBNs found.");
      }
      setIsLoading(false);
    });
  };

  const REACT_APP_NOTION_TOKEN = "YOUR API KEY HERE";
  const REACT_NOTION_DATABASE_ID = "YOUR API KEY HERE";

  const handleSaveToNotion = async () => {
    if (book) {
      try {
        await postToNotion(
          book,
          REACT_APP_NOTION_TOKEN,
          REACT_NOTION_DATABASE_ID,
        );
        setShowModal(true);
      } catch (error) {
        console.error("Failed to save book to Notion:", error);
        setErrorText("ERROR: Failed to save book to Notion.");
      }
    }
  };

  const resetBooks = () => {
    setBook(null);
    setIsbn("");
    setReset(false);
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <img src="../book.png" alt="Notion Library" className="app-logo" />
          <div className="header-text">
            <h1 className="app-title">notion library</h1>
            <p className="app-subtitle">
              Search for books at{" "}
              <a
                href="https://books.google.com/"
                target="_blank"
                rel="noreferrer"
                className="link-primary"
              >
                Google Books
              </a>
            </p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="action-section">
          <Button
            pressFunction={reset ? resetBooks : findBooks}
            text={reset ? "Reset" : "Detect Books"}
            color="#262626"
          />
        </div>

        {isLoading && (
          <div className="loading-container">
            <img src="../loader.gif" alt="Loading..." width={130} />
            <p className="loading-text">Searching for books...</p>
          </div>
        )}

        {book && !isLoading && (
          <div className="book-section">
            <div className="divider"></div>
            <div className="book-card">
              <div className="book-info">
                <h2 className="book-title">{book.title}</h2>
                <p className="book-authors">
                  <span className="label">by</span> {book.authors}
                </p>
                <p className="book-isbn">
                  <span className="label">ISBN:</span> {isbn}
                </p>
              </div>

              {book.imageUrl && (
                <div className="book-image-container">
                  <img
                    src={book.imageUrl}
                    alt={`Cover of ${book.title}`}
                    className="book-cover"
                  />
                </div>
              )}
            </div>

            <div className="save-section">
              <Button
                pressFunction={handleSaveToNotion}
                text="Save to Notion"
                color="#0077d4"
              />
            </div>
          </div>
        )}

        {!book && !isLoading && (
          <div className="empty-state">
            {errorText ? (
              <div className="error-message">
                <div className="error-icon">⚠️</div>
                <p className="error-text">{errorText}</p>
              </div>
            ) : (
              <div className="instructions">
                <div className="instruction-icon">📚</div>
                <p className="instruction-text">
                  Click 'Detect Books' to load book details from the current
                  page
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-body">
              <div className="success-icon">✅</div>
              <h3 className="modal-title">Success!</h3>
              <p className="modal-text">Book saved to Notion</p>
              <div className="modal-animation">
                <Lottie
                  options={defaultOptions}
                  height={60}
                  width={120}
                  isPaused={false}
                  isStopped={false}
                />
              </div>
            </div>
            <div className="modal-footer">
              <Button
                pressFunction={() => setShowModal(false)}
                text="Got it"
                color="#101010"
              />
            </div>
          </div>
        </div>
      )}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <a
              href="https://github.com/gdcho/notion-lib/blob/main/README.md"
              target="_blank"
              rel="noreferrer"
              className="link-secondary"
            >
              📖 Setup & usage instructions
            </a>
          </div>
          <div className="footer-section">
            <span className="footer-text">
              Made with <span className="heart">❤️</span> by{" "}
              <a
                href="https://github.com/rj-labs-co"
                target="_blank"
                rel="noreferrer"
                className="link-secondary"
              >
                rj labs
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
