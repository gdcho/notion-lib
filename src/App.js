import React, { useState, useEffect } from "react";
import "./App.css";
import fetchBookDetails from "./utils/fetchBookDetails";
import postToNotion from "./utils/postToNotion";
import Button from "./components/Button";
import Lottie from "react-lottie";
import animation from "./lottie/book.json";
import {
  Eye,
  EyeOff,
  Settings,
  AlertTriangle,
  CheckCircle,
  Heart,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";

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

  const [showGoogleKey, setShowGoogleKey] = useState(false);
  const [showNotionToken, setShowNotionToken] = useState(false);

  const [isDark, setIsDark] = useState(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
  );

  const [isValidating, setIsValidating] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

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

  const validateKeys = async (gbKey, nToken, nDbId) => {
    const errors = {};

    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=test&key=${gbKey}&maxResults=1`,
      );
      if (res.status === 400) {
        errors.googleBooksApiKey = "Invalid Google Books API key";
      }
    } catch {
      errors.googleBooksApiKey = "Could not reach Google Books API";
    }

    try {
      const cleanDbId = nDbId
        .replace(/-/g, "")
        .replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
      const res = await fetch(
        `https://api.notion.com/v1/databases/${cleanDbId}`,
        {
          headers: {
            Authorization: `Bearer ${nToken}`,
            "Notion-Version": "2022-06-28",
          },
        },
      );
      if (res.status === 401) {
        errors.notionToken = "Invalid Notion integration token";
      } else if (res.status === 404) {
        errors.notionDatabaseId =
          "Database not found — share it with your integration first";
      }
    } catch {
      errors.notionToken = "Could not reach Notion API";
    }

    return errors;
  };

  const saveApiKeys = async () => {
    if (
      !googleBooksApiKey.trim() ||
      !notionToken.trim() ||
      !notionDatabaseId.trim()
    ) {
      setFormError("All fields are required.");
      return;
    }

    setIsValidating(true);
    setFormError("");
    setFieldErrors({});

    const errors = await validateKeys(
      googleBooksApiKey,
      notionToken,
      notionDatabaseId,
    );
    setIsValidating(false);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // eslint-disable-next-line no-undef
    chrome.storage.local.set(
      { googleBooksApiKey, notionToken, notionDatabaseId },
      () => {
        setApiKeysConfigured(true);
        setShowApiKeyForm(false);
        setFormError("");
        setFieldErrors({});
      },
    );
  };

  const findBooks = async () => {
    if (!apiKeysConfigured) {
      setErrorText("Please configure your API keys first.");
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
          setErrorText("Book not found or API request failed.");
        }
      } else {
        setErrorText(
          "No ISBNs found on this page. Navigate to a book page on Google Books first.",
        );
      }
      setIsLoading(false);
    });
  };

  const handleSaveToNotion = async () => {
    if (book) {
      try {
        await postToNotion(book, notionToken, notionDatabaseId);
        setShowModal(true);
        setErrorText("");
      } catch (error) {
        console.error("Failed to save book to Notion:", error);
        setErrorText(
          "Failed to save to Notion. Make sure the database is shared with your integration.",
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
        resetBooks();
      },
    );
  };

  const clearFieldError = (field) =>
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
  };

  return (
    <div className={`app-container${isDark ? " dark" : " light"}`}>
      <header className="app-header">
        <div className="header-content">
          <img src="../book.png" alt="Notion Library" className="app-logo" />
          <div className="header-text">
            <h1 className="app-title">notion library</h1>
          </div>
        </div>
        <div className="api-status">
          <button
            className="reset-keys-btn"
            onClick={() => setIsDark((v) => !v)}
            title="Toggle dark mode"
          >
            {isDark ? (
              <Sun size={14} strokeWidth={1.5} />
            ) : (
              <Moon size={14} strokeWidth={1.5} />
            )}
          </button>
          {apiKeysConfigured && (
            <>
              <span className="status-dot" title="API keys configured" />
              <button
                className="reset-keys-btn"
                onClick={resetApiKeys}
                title="Reset API Keys"
              >
                <Settings size={14} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        {showApiKeyForm ? (
          <div className="form-container">
            <div className="form-header">
              <h2>Configure API Keys</h2>
              <p>Connect your Google Books and Notion accounts</p>
            </div>

            {formError && <div className="form-error-banner">{formError}</div>}

            <div className="form-group">
              <label htmlFor="googleBooksApiKey">Google Books API Key</label>
              <div className="input-wrapper">
                <input
                  type={showGoogleKey ? "text" : "password"}
                  id="googleBooksApiKey"
                  value={googleBooksApiKey}
                  onChange={(e) => {
                    setGoogleBooksApiKey(e.target.value);
                    clearFieldError("googleBooksApiKey");
                  }}
                  placeholder="AIza..."
                  className={`api-input${fieldErrors.googleBooksApiKey ? " input-error" : ""}`}
                />
                <button
                  type="button"
                  className="toggle-visibility-btn"
                  onClick={() => setShowGoogleKey((v) => !v)}
                  tabIndex={-1}
                >
                  {showGoogleKey ? (
                    <EyeOff size={13} strokeWidth={1.5} />
                  ) : (
                    <Eye size={13} strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {fieldErrors.googleBooksApiKey && (
                <span className="field-error">
                  {fieldErrors.googleBooksApiKey}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="notionToken">Notion Integration Token</label>
              <div className="input-wrapper">
                <input
                  type={showNotionToken ? "text" : "password"}
                  id="notionToken"
                  value={notionToken}
                  onChange={(e) => {
                    setNotionToken(e.target.value);
                    clearFieldError("notionToken");
                  }}
                  placeholder="secret_..."
                  className={`api-input${fieldErrors.notionToken ? " input-error" : ""}`}
                />
                <button
                  type="button"
                  className="toggle-visibility-btn"
                  onClick={() => setShowNotionToken((v) => !v)}
                  tabIndex={-1}
                >
                  {showNotionToken ? (
                    <EyeOff size={13} strokeWidth={1.5} />
                  ) : (
                    <Eye size={13} strokeWidth={1.5} />
                  )}
                </button>
              </div>
              {fieldErrors.notionToken && (
                <span className="field-error">{fieldErrors.notionToken}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="notionDatabaseId">Notion Database ID</label>
              <input
                type="text"
                id="notionDatabaseId"
                value={notionDatabaseId}
                onChange={(e) => {
                  setNotionDatabaseId(e.target.value);
                  clearFieldError("notionDatabaseId");
                }}
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className={`api-input${fieldErrors.notionDatabaseId ? " input-error" : ""}`}
              />
              {fieldErrors.notionDatabaseId && (
                <span className="field-error">
                  {fieldErrors.notionDatabaseId}
                </span>
              )}
            </div>

            <div className="form-actions">
              <Button
                pressFunction={saveApiKeys}
                text={isValidating ? "Verifying..." : "Save & Verify"}
                color="#37352f"
                disabled={isValidating}
              />
            </div>

            <div className="setup-help">
              <a
                href="https://github.com/gdcho/notion-lib/blob/main/README.md"
                target="_blank"
                rel="noreferrer"
                className="link-muted"
              >
                Setup instructions{" "}
                <ExternalLink
                  size={11}
                  strokeWidth={1.5}
                  style={{ display: "inline", verticalAlign: "middle" }}
                />
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="action-section">
              <Button
                pressFunction={reset ? resetBooks : findBooks}
                text={reset ? "Reset" : "Detect Books"}
                color="#37352f"
                disabled={!apiKeysConfigured}
              />
            </div>

            {isLoading && (
              <div className="loading-container">
                <div className="spinner" />
                <p className="loading-text">Searching for books...</p>
              </div>
            )}

            {book && !isLoading && (
              <div className="book-section">
                <div className="book-card">
                  <div className="book-layout">
                    <div className="book-info">
                      <h2 className="book-title">{book.title}</h2>
                      <p className="book-authors">{book.authors}</p>
                      <p className="book-isbn">ISBN {isbn}</p>
                    </div>
                    {book.imageUrl && (
                      <img
                        src={book.imageUrl}
                        alt={`Cover of ${book.title}`}
                        className="book-cover"
                      />
                    )}
                  </div>
                </div>
                <div className="save-section">
                  <Button
                    pressFunction={handleSaveToNotion}
                    text="Save to Notion"
                    color="#2383e2"
                  />
                </div>
              </div>
            )}

            {!book && !isLoading && (
              <div className="empty-state">
                {errorText ? (
                  <div className="error-message">
                    <AlertTriangle
                      size={13}
                      strokeWidth={1.5}
                      className="error-icon-sm"
                    />
                    <p className="error-text">{errorText}</p>
                  </div>
                ) : (
                  <div className="cta-card">
                    <p className="cta-title">Find a book to save</p>
                    <p className="cta-text">
                      Navigate to a book page on Google Books, then click Detect
                      Books.
                    </p>
                    <a
                      href="https://books.google.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="cta-link"
                    >
                      Open Google Books{" "}
                      <ExternalLink
                        size={11}
                        strokeWidth={1.5}
                        style={{ display: "inline", verticalAlign: "middle" }}
                      />
                    </a>
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
              <div className="success-icon">
                <CheckCircle
                  size={24}
                  strokeWidth={1.5}
                  className="success-check"
                />
              </div>
              <h3 className="modal-title">Saved to Notion</h3>
              <p className="modal-text">
                {book?.title} has been added to your database.
              </p>
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
                text="Done"
                color="#37352f"
              />
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <div className="footer-content">
          <span className="footer-text">
            Made with <Heart size={11} strokeWidth={1.5} className="heart" /> by{" "}
            <a
              href="https://github.com/rj-labs-co"
              target="_blank"
              rel="noreferrer"
              className="link-muted"
            >
              rj labs
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
