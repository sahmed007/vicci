function describePage() {
  const title = document.title;
  const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent);
  const links = document.links.length;

  const description = `This page is titled ${title}. ` +
    `It contains ${headings.length} main headings and ${links} links. ` +
    `The main headings are: ${headings.join(', ')}`;

  chrome.runtime.sendMessage({action: "speak", text: description});
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "describePage") {
    describePage();
  }
});

console.log("VICCI content script loaded");