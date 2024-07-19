console.log('VICCI Content Script: Initializing...');

let isVicciActive = false;

function activateVicci() {
  console.log('VICCI Content Script: Activating VICCI');
  isVicciActive = true;
  speakFeedback("VICCI activated. Press H for help.");
}

function deactivateVicci() {
  console.log('VICCI Content Script: Deactivating VICCI');
  isVicciActive = false;
  speakFeedback("VICCI deactivated.");
}

function speakFeedback(text) {
  console.log('VICCI Content Script: Speaking feedback:', text);
  chrome.runtime.sendMessage({action: "speak", text: text}, (response) => {
    console.log('VICCI Content Script: TTS response:', response);
  });
}

document.addEventListener('keydown', (event) => {
  console.log('VICCI Content Script: Keydown event:', event.key);
  
  if (event.ctrlKey && event.shiftKey && event.key === 'V') {
    console.log('VICCI Content Script: Activation shortcut detected');
    if (isVicciActive) {
      deactivateVicci();
    } else {
      activateVicci();
    }
  }

  if (isVicciActive) {
    switch(event.key.toLowerCase()) {
      case 'h':
        console.log('VICCI Content Script: Help command detected');
        provideHelp();
        break;
      case 'd':
        console.log('VICCI Content Script: Describe page command detected');
        describePage();
        break;
      // Add more command handlers here
    }
  }
});

function provideHelp() {
  console.log('VICCI Content Script: Providing help');
  const helpText = `
    Available commands:
    H: Help
    D: Describe page
    Ctrl+Shift+V: Activate or deactivate VICCI
  `;
  speakFeedback(helpText);
}

function describePage() {
  console.log('VICCI Content Script: Describing page');
  try {
    const pageStructure = getPageStructure(); // Assume this function is defined in dom-parser.js
    const description = `
      Page title: ${pageStructure.title}.
      It contains ${pageStructure.headings.length} headings,
      ${pageStructure.links.length} links, and
      ${pageStructure.paragraphs} paragraphs.
    `;
    speakFeedback(description);
  } catch (error) {
    console.error('VICCI Content Script: Error describing page:', error);
    speakFeedback("Sorry, I encountered an error while describing the page.");
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('VICCI Content Script: Received message', request);
  
  if (request.action === "activateVicci") {
    activateVicci();
  } else if (request.action === "describePage") {
    describePage();
  }
});

console.log('VICCI Content Script: Initialization complete');
console.log('VICCI Content Script: Initialization complete');