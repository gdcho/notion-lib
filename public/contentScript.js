const regexISBN = new RegExp(
  /978-\d{10}|978\s\d{10}|978\d{10}|978-\d{1}-\d{5}-\d{3}-\d{1}|978\s\d{1}\s\d{5}\s\d{3}\s\d{1}|979-\d{10}|979\s\d{10}|979\d{10}|979-\d{1}-\d{5}-\d{3}-\d{1}|979\s\d{1}\s\d{5}\s\d{3}\s\d{1}/,
  "g",
);
const isbns = document.body.innerText.match(regexISBN);

if (isbns) {
  // eslint-disable-next-line no-undef
  chrome.runtime.sendMessage({ type: "FIND_BOOKS", payload: isbns });
}
