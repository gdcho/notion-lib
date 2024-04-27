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

  const handleSaveToNotion = async () => {
    if (book) {
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await postToNotion(
          book,
          process.env.REACT_APP_NOTION_TOKEN,
          process.env.REACT_NOTION_DATABASE_ID
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
    <div className="container" style={{ padding: 20 }}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <img src="../book.png" alt="notion library logo" width={50}></img>
        <p style={{ fontSize: 16, paddingTop: 3, color: "#101010" }}>
          <i>
            <b>notion library</b>
          </i>
        </p>
      </div>
      <div
        style={{
          paddingBottom: 10,
        }}
      >
        <small>
          Search for books at{" "}
          <a
            href="https://books.google.com/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "black" }}
          >
            Google Books
          </a>
        </small>
      </div>
      <Button
        pressFunction={reset ? resetBooks : findBooks}
        text={reset ? "Reset" : "Detect Books"}
        color="#262626"
      />
      {isLoading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 20,
          }}
        >
          <img src="../loader.gif" alt="loader" width={130} />
        </div>
      ) : book ? (
        <div style={{ paddingBottom: 20 }}>
          <div style={{ paddingTop: 10, paddingBottom: 10 }}>
            <hr
              style={{
                borderTop: "3px solid #e89c34",
                borderRadius: 10,
              }}
            />
          </div>
          <div
            style={{
              boxShadow: "0 2px 4px 0px gray",
              borderRadius: 5,
              paddingBottom: 20,
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 5,
              justifyContent: "center",
              textAlign: "center",
            }}
          >
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
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  style={{
                    width: "100px",
                    borderRadius: 10,
                    boxShadow: "0 0 10px #000",
                  }}
                />
              </div>
            )}
          </div>
          <div style={{ paddingTop: 20 }}>
            <Button
              pressFunction={handleSaveToNotion}
              text={"Save to Notion"}
              color="#0077d4"
            />
          </div>
        </div>
      ) : (
        <div style={{ paddingBottom: 20 }}>
          {errorText && <p>{errorText}</p>}
          <p>Click 'Detect Books' to load book details</p>
        </div>
      )}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <div style={{ paddingBottom: 20 }}>
              <p>Book saved to Notion</p>
              <Lottie
                options={defaultOptions}
                height={50}
                width={100}
                isPaused={false}
                isStopped={false}
              />
            </div>
            <Button
              pressFunction={() => setShowModal(false)}
              text={"Got it"}
              color={"#101010"}
            />
          </div>
        </div>
      )}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          paddingBottom: 10,
          paddingTop: 30,
        }}
      >
        <small>
          Made with ❤️ by{" "}
          <a
            href="https://github.com/gdcho"
            target="_blank"
            rel="noreferrer"
            style={{ color: "black" }}
          >
            gdcho
          </a>
        </small>
      </div>
    </div>
  );
}

export default App;
