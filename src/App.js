import React, { useState, useEffect } from "react";
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

  const [apiKeysConfigured, setApiKeysConfigured] = useState(false);
  const [showApiKeyForm, setShowApiKeyForm] = useState(false);
  const [googleBooksApiKey, setGoogleBooksApiKey] = useState("");
  const [notionToken, setNotionToken] = useState("");
  const [notionDatabaseId, setNotionDatabaseId] = useState("");

  useEffect(() => {
    checkApiKeys();
  }, []);

  const checkApiKeys = () => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.get(
      ["googleBooksApiKey", "notionToken", "notionDatabaseId"],
      (result) => {
        const hasGoogleBooksKey =
          result.googleBooksApiKey &&
          result.googleBooksApiKey !== "YOUR API KEY HERE";
        const hasNotionToken =
          result.notionToken && result.notionToken !== "YOUR API KEY HERE";
        const hasNotionDbId =
          result.notionDatabaseId &&
          result.notionDatabaseId !== "YOUR API KEY HERE";

        if (hasGoogleBooksKey && hasNotionToken && hasNotionDbId) {
          setApiKeysConfigured(true);
          setGoogleBooksApiKey(result.googleBooksApiKey);
          setNotionToken(result.notionToken);
          setNotionDatabaseId(result.notionDatabaseId);
        } else {
          setApiKeysConfigured(false);
          setShowApiKeyForm(true);
        }
      },
    );
  };

  const saveApiKeys = () => {
    if (
      !googleBooksApiKey.trim() ||
      !notionToken.trim() ||
      !notionDatabaseId.trim()
    ) {
      setErrorText("ERROR: All API keys are required.");
      return;
    }

    // eslint-disable-next-line no-undef
    chrome.storage.local.set(
      {
        googleBooksApiKey,
        notionToken,
        notionDatabaseId,
      },
      () => {
        setApiKeysConfigured(true);
        setShowApiKeyForm(false);
        setErrorText("");
      },
    );
  };

  const findBooks = async () => {
    if (!apiKeysConfigured) {
      setErrorText("ERROR: Please configure your API keys first.");
      return;
    }

    setIsLoading(true);
    setReset(true);
    setErrorText("");

    // eslint-disable-next-line no-undef
    chrome.storage.local.get(["isbns"], async (result) => {
      if (result.isbns) {
        const cleanIsbn = result.isbns[0].replace(/[-\s]/g, "");
        const bookDetails = await fetchBookDetails(
          cleanIsbn,
          googleBooksApiKey,
        );
        setIsbn(cleanIsbn);
        setBook(bookDetails);

        if (!bookDetails) {
          setErrorText("ERROR: Book not found or API request failed.");
        }
      } else {
        setErrorText("ERROR: No ISBNs found.");
      }
      setIsLoading(false);
    });
  };

  const handleSaveToNotion = async () => {
    if (!apiKeysConfigured) {
      setErrorText("ERROR: Please configure your API keys first.");
      return;
    }

    if (book) {
      try {
        await postToNotion(book, notionToken, notionDatabaseId);
        setShowModal(true);
        setErrorText("");
      } catch (error) {
        console.error("Failed to save book to Notion:", error);
        setErrorText(
          "ERROR: Failed to save book to Notion. Check your Notion API keys.",
        );
      }
    }
  };

  const resetBooks = () => {
    setBook(null);
    setIsbn("");
    setReset(false);
    setErrorText("");
  };

  const resetApiKeys = () => {
    // eslint-disable-next-line no-undef
    chrome.storage.local.remove(
      ["googleBooksApiKey", "notionToken", "notionDatabaseId"],
      () => {
        setApiKeysConfigured(false);
        setShowApiKeyForm(true);
        // setGoogleBooksApiKey("");
        // setNotionToken("");
        // setNotionDatabaseId("");
        resetBooks();
      },
    );
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
        {apiKeysConfigured && (
          <div className="api-status">
            <span className="status-indicator">✅ API Keys Configured</span>
            <button
              className="reset-keys-btn"
              onClick={resetApiKeys}
              title="Reset API Keys"
            >
              ⚙️
            </button>
          </div>
        )}
      </header>

      <main className="main-content">
        {showApiKeyForm ? (
          <div>
            <div className="form-header">
              <h2>🔑 Configure API Keys</h2>
              <p>Enter your API keys to get started</p>
            </div>

            <div className="form-group">
              <label htmlFor="googleBooksApiKey">Google Books API Key</label>
              <input
                type="password"
                id="googleBooksApiKey"
                value={googleBooksApiKey}
                onChange={(e) => setGoogleBooksApiKey(e.target.value)}
                placeholder="Google Books API key"
                className="api-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notionToken">Notion Integration Token</label>
              <input
                type="password"
                id="notionToken"
                value={notionToken}
                onChange={(e) => setNotionToken(e.target.value)}
                placeholder="Notion integration token"
                className="api-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notionDatabaseId">Notion Database ID</label>
              <input
                type="text"
                id="notionDatabaseId"
                value={notionDatabaseId}
                onChange={(e) => setNotionDatabaseId(e.target.value)}
                placeholder="Notion database ID"
                className="api-input"
              />
            </div>

            <div className="form-actions">
              <Button
                pressFunction={saveApiKeys}
                text="Save API Keys"
                color="#667eea"
              />
            </div>

            <div className="setup-help">
              <p>Need help setting up? Check the</p>
              <a
                href="https://github.com/gdcho/notion-lib/blob/main/README.md"
                target="_blank"
                rel="noreferrer"
                className="link-primary"
              >
                📖 Setup instructions
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="action-section">
              <Button
                pressFunction={reset ? resetBooks : findBooks}
                text={reset ? "🤚 Reset" : "🔍 Detect Books"}
                color="#667eea"
                disabled={!apiKeysConfigured}
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
                    text="💾 Save to Notion"
                    color="#667eea"
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
          </>
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
                text="🙌 Got it"
                color="#667eea"
              />
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <div className="footer-content">
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
            <span className="footer-divider"> | </span>
            <a
              href="https://www.buymeacoffee.com/rjsgml"
              target="_blank"
              rel="noreferrer"
              className="link-secondary"
              title="Support my work"
            >
              ☕ Buy me a coffee
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
