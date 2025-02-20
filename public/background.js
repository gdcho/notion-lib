/* eslint-disable no-undef */
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and background service worker started.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "FIND_BOOKS") {
    chrome.storage.local.set({ isbns: message.payload }, () => {
      console.log("ISBNs saved locally.");
      sendResponse({ success: true, message: "ISBNs updated for search." });
    });
    return true;
  }
});
