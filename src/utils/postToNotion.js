async function postToNotion(bookDetails, notionToken, notionDatabaseId) {
  const authorsArray = Array.isArray(bookDetails.authors)
    ? bookDetails.authors
    : [bookDetails.authors].filter(Boolean);

  const bodyData = {
    parent: { database_id: notionDatabaseId },
    properties: {
      Title: {
        title: [
          {
            text: {
              content: bookDetails.title,
            },
          },
        ],
      },
      Author: {
        rich_text: [
          {
            text: {
              content: authorsArray.join(", "),
            },
          },
        ],
      },
      Link: {
        url: bookDetails.link,
      },
      "Total pages": {
        number: parseInt(bookDetails.totalPages, 10),
      },
      "Current page": {
        number: 0,
      },
      Summary: {
        rich_text: [
          {
            text: {
              content: bookDetails.summary,
            },
          },
        ],
      },
    },
  };

  const response = await fetch(`https://api.notion.com/v1/pages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${notionToken}`,
      "Content-Type": "application/json",
      "Notion-Version": "2021-08-16",
    },
    body: JSON.stringify(bodyData),
  });

  try {
    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      const textResponse = await response.text();
      throw new Error(`Failed to post to Notion: ${textResponse}`);
    }
  } catch (error) {
    console.error("Failed to parse response as JSON:", error);
    throw new Error("Failed to process the response");
  }
}

export default postToNotion;
