<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#technology-used">Technology used</a>      
    </li>
    <li><a href="#getting-started">Getting started</a></li>
    <li><a href="#file-contents-of-folder">File Contents of folder</a></li>
    <li><a href="#learn-more">Learn More</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</details>
<br />
<div align="center">
  <a href="https://github.com/gdcho/notion-lib">
    <img src="/public/book.png" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">notion lib</h3>

  <p align="center">
    notion lib is a chrome extension that allows you to save book details to your Notion database.
    <br />
    <a href="https://github.com/gdcho/notion-lib"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/gdcho/notion-lib">See Project</a>
    ·
    <a href="https://github.com/gdcho/notion-lib/issues">Report Bug</a>
    ·
    <a href="https://github.com/gdcho/notion-lib/issues">Request Feature</a>
  </p>
</div>

## Technology used

![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)
![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=for-the-badge)
![Notion API Badge](https://img.shields.io/badge/Notion%20API-000000?style=for-the-badge&logo=notion&logoColor=white)
![Chrome Badge](https://img.shields.io/badge/Chrome-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)
![Google Badge](https://img.shields.io/badge/Google%20Books-4285F4?style=for-the-badge&logo=google&logoColor=white)
![Post CSS Badge](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)
![Postman Badge](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

## How it works

1. After installing the extension, go to Google Books and search for a book
2. Click on the extension icon and click on the `Detect Books` button
   <img src="/public/images/stepOne.png" alt="Logo" width="auto" height="auto">
3. The book details will be displayed
   <img src="/public/images/stepTwo.png" alt="Logo" width="auto" height="auto">
4. Click on the `Save to Notion` button
   <img src="/public/images/stepThree.png" alt="Logo" width="auto" height="auto">
5. The book details will be saved to your Notion database
   <img src="/public/images/lastStep.png" alt="Logo" width="auto" height="auto">

## Getting Started

1. Clone the repository

```sh
   git clone https://github.com/gdcho/notion-lib
```

2. Go to `https://www.notion.com/my-integrations` and create a new integration to get the `NOTION_API_KEY`
3. Go to your notion database, then share --> publish and copy the link and update the `NOTION_DATABASE_URL`. The link should look like `https://www.notion.so/your-workspace/your-database-id?view=your-view-id`
4. Go to notion connections and add the integration to your database
5. Go to `src/App.js` and update the `NOTION_API_KEY` and `NOTION_DATABASE_ID` with your Notion API key and database ID or add to .env and use process.env
6. Run `npm install`
7. Run `npm run build`
8. Load the extension in Chrome by going to `chrome://extensions/` and clicking on `Load unpacked` and selecting the `build` folder
9. Go to Google Books `https://books.google.com/` and search for a book
10. Click on the extension icon and click on the `Save to Notion` button
11. The book details will be saved to Notion

## File Contents of folder

```
📦
├── README.md
├── build
│   ├── asset-manifest.json
│   ├── background.js
│   ├── book.png
│   ├── contentScript.js
│   ├── favicon.ico
│   ├── index.html
│   ├── loader.gif
│   ├── manifest.json
│   ├── robots.txt
│   └── static
├── node_modules
├── package.json
├── public
│   ├── background.js
│   ├── book.png
│   ├── contentScript.js
│   ├── favicon.ico
│   ├── index.html
│   ├── loader.gif
│   ├── manifest.json
│   └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── components
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── lottie
    ├── reportWebVitals.js
    ├── setupTests.js
    └── utils
```

## Learn More

To learn more about Notion API, take a look at the following resources:

- [Notion API Documentation](https://developers.notion.com/) - learn about Notion API features and API.
- [Notion API Postman Collection](https://www.postman.com/notionhq/workspace/notion-api/) - a Postman collection for Notion API.

To learn more about Google Books API, take a look at the following resources:

- [Google Books API Documentation](https://developers.google.com/books) - learn about Google Books API features and API.
- [Google Books API Postman Collection](https://www.postman.com/postman/workspace/commerce-api/collection/12959542-3af65ab4-e837-44fa-909f-243d118ccc6c) - a Postman collection for Google Books API.

To learn more about Chrome Extension, take a look at the following resources:

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/mv3/getstarted/) - learn about Chrome Extension features and API.
- [Chrome Extension Tutorial](https://developer.chrome.com/docs/extensions/mv3/getstarted/) - an interactive Chrome Extension tutorial.

## References

[Google Books API](https://developers.google.com/books) ·
[Notion API](https://developers.notion.com/) ·
[Chrome Extension](https://developer.chrome.com/docs/extensions/mv3/getstarted/)
