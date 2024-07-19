// Listen for the extension's activation command
chrome.commands.onCommand.addListener((command) => {
  if (command === "activate-vicci") {
    chrome.tts.speak("VICCI activated. How can I assist you?");
  } else if (command === "describe-page") {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {action: "describePage"});
    });
  }
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "speak") {
    chrome.tts.speak(request.text);
  }
});