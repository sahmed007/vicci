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


//Listen for TTS from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "speak") {
    chrome.tts.speak(request.text, {
      'rate': 1.0,  // Speech rate (0.1 to 10.0)
      'pitch': 1.0, // Speech pitch (0.0 to 2.0)
      'onEvent': function(event) {
        if (event.type === 'end') {
          sendResponse({status: "completed"});
        }
      }
    });
    return true;  // Indicates we wish to send a response asynchronously
  }
});