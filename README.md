# notion-lib

## React chrome extension for Notion.so that saves books found on Google Books by looking up the ISBN and querying the book details from Google Books API.

### Development Steps:

- [x] Set up chrome extension (manifest.json)
- [x] Set up React app (npx create-react-app react-chrome-extension)
- [x] Create context script
- [x] Integration with Google Books API (https://developers.google.com/books)
- [x] Manage Chrome Extension Behaviour (Background script, Popup UI, Context script)
- [x] Integration with Notion API (https://developers.notion.com/)
- [ ] UI/UX Design
- [ ] Build, Test, Load, Publish

### How to use:

1. Clone the repository
2. Go to `https://www.notion.com/my-integrations` and create a new integration to get the `NOTION_API_KEY`
3. Go to your notion database, then share --> publish and copy the link and update the `NOTION_DATABASE_URL`. The link should look like `https://www.notion.so/your-workspace/your-database-id?view=your-view-id`
4. Go to `src/App.js` and update the `NOTION_API_KEY` and `NOTION_DATABASE_ID` with your Notion API key and database ID or add to .env and use process.env
5. Run `npm install`
6. Run `npm run build`
7. Load the extension in Chrome by going to `chrome://extensions/` and clicking on `Load unpacked` and selecting the `build` folder
8. Go to Google Books `https://books.google.com/` and search for a book
9. Click on the extension icon and click on the `Save to Notion` button
10. The book details will be saved to Notion
