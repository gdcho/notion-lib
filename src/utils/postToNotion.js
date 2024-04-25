// src/utils/postToNotion.js
async function postToNotion(bookDetails, notionToken, notionDatabaseId) {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${notionToken}`,
      "Content-Type": "application/json",
      "Notion-Version": "2021-05-13",
    },
    body: JSON.stringify({
      parent: { database_id: notionDatabaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: bookDetails.title,
              },
            },
          ],
        },
        // Additional properties like author, publisher can be added here
      },
    }),
  });
  return response.json();
}

export default postToNotion;
