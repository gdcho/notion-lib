# notion-lib

## React chrome extension for Notion.so that saves books found on Google Books by looking up the ISBN and querying the book details from Google Books API.

### Development Steps:

- [x] Set up chrome extension (manifest.json)
- [x] Set up React app (npx create-react-app react-chrome-extension)
- [x] Create context script
- [x] Integration with Google Books API (https://developers.google.com/books)
- [x] Manage Chrome Extension Behaviour (Background script, Popup UI, Context script)
- [ ] Integration with Notion API (https://developers.notion.com/)
- [ ] UI/UX Design
- [ ] Build, Test, Load, Publish

### How to use:

1. Clone the repository
2. Run `npm install`
3. Run `npm run build`
4. Load the extension in Chrome by going to `chrome://extensions/` and clicking on `Load unpacked` and selecting the `build` folder.
5. Go to Google Books `https://books.google.com/` and search for a book.
6. Click on the extension icon and click on the `Save to Notion` button.
7. The book details will be saved to Notion.
