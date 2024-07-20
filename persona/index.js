const config = {
  initialMessage: `Hello, I'm Vicky, your Vision Impaired Computer Control Interface. How can I assist you today?`,
  prompt: window.VICCI.prompt,
  actions: window.VICCI.actions,
  ttsConfig: {
    voiceId: 'c47c1e8a-0cf4-43e4-9c10-484c7c73b00e'
  },
  llmConfig: {
    llm: 'llama-3-70b',
    temperature: 0.9,
    repetitionPenalty: 0.5,
  },
  interjections: {
    enabled: true,
    minWait: 5000,
    maxWait: 7500,
    thought: `There was just a pause; I should keep the conversation going.`
  }
};

// Expose the variable to the global scope
window.VICCI = window.VICCI || {};
window.VICCI.config = config;

document.addEventListener('DOMContentLoaded', () => {
  // Load the PersonaClient script dynamically
  var script = document.createElement("script");
  script.src = "https://api.prod.centralus.az.sindarin.tech/PersonaClientPublicV2?apikey=208afb4d-b3ba-473e-8926-c6b4e0e47795";
  script.onload = () => {
    window.personaClient = new window.PersonaClient.default("c124b7ef-6236-4391-a492-a30052779d9b");
    initializePersonaClient();
  };
  document.head.appendChild(script);

  function initializePersonaClient() {
    const personaConfig = {
      userId: "admin",
      personaName: "John",
      options: {
        debugMode: true,
        streamTranscripts: true,
        shouldNotSaveConversation: true,
      },
    };

    window.personaClient.init(personaConfig)
      .then(() => {
        configurePersonaEvents();
        promptMicrophoneAccess();
      })
      .catch(error => {
        console.log(error);
      });
  }

  function configurePersonaEvents() {
    window.personaClient.on("messages_update", messages => {
      console.log(messages);
    });

    window.personaClient.on("state_updated", newState => {
      console.log(newState);
    });

    window.personaClient.on("action", action => {
      console.log(action);
    });

    window.personaClient.on("error", error => {
      console.log(error);
    });

    window.personaClient.on("connect_error", error => {
      console.log(error);
    });
  }

  function promptMicrophoneAccess() {
    speakFeedback("Please allow microphone access to enable voice commands.");

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log('Microphone access granted');
        speakFeedback("Microphone access granted. You can now use voice commands.");
        initializeMicrophone();
      })
      .catch(error => {
        console.error('Microphone access denied:', error);
        speakFeedback("Microphone access denied. Please enable it in your browser settings.");
      });
  }

  function initializeMicrophone() {
    if (!('webkitSpeechRecognition' in window)) {
      console.log("Speech recognition not supported");
      speakFeedback("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Voice recognition started.');
      speakFeedback("Voice recognition started. You can now give voice commands.");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript.trim();
      console.log('Voice command received:', transcript);
      handleVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.log('Voice recognition error:', event.error);
      speakFeedback(`Voice recognition error: ${event.error}`);
    };

    recognition.onend = () => {
      console.log('Voice recognition ended.');
      // Optionally, restart recognition after a pause
      recognition.start();
    };

    recognition.start();
  }

  function handleVoiceCommand(command) {
    // Handle voice commands to control chat and other actions
    if (command.toLowerCase().includes('start chat')) {
      window.VICCI.actions.startChat();
    } else if (command.toLowerCase().includes('pause chat')) {
      window.VICCI.actions.pauseChat();
    } else if (command.toLowerCase().includes('resume chat')) {
      window.VICCI.actions.resumeChat();
    } else if (command.toLowerCase().includes('stop chat')) {
      window.VICCI.actions.stopChat();
    } else if (command.toLowerCase().includes('describe page')) {
      window.VICCI.actions.describePage();
    }
    // Add more voice command handlers as needed
  }

  function speakFeedback(text) {
    chrome.tts.speak(text, {
      'rate': 1.0,
      'pitch': 1.0,
      'volume': 1.0,
      'voiceName': window.VICCI.config.ttsConfig.voiceId,
      'onEvent': function(event) {
        if (event.type === 'end') {
          console.log('Feedback spoken:', text);
        }
      }
    });
  }

  // Chat control functions
  window.VICCI.actions.startChat = () => {
    const personaConfig = {
      userId: "admin",
      personaName: "John",
      options: {
        debugMode: true,
        streamTranscripts: true,
        shouldNotSaveConversation: true,
      },
    };

    window.personaClient.init(personaConfig)
      .then(() => {
        configurePersonaEvents();
      })
      .catch(error => {
        console.log(error);
      });
  };

  window.VICCI.actions.pauseChat = () => {
    window.personaClient.pause().catch(error => console.log(error));
  };

  window.VICCI.actions.resumeChat = () => {
    window.personaClient.resume().catch(error => console.log(error));
  };

  window.VICCI.actions.stopChat = () => {
    window.personaClient.end().catch(error => console.log(error));
  };

  window.VICCI.actions.updateState = (newState) => {
    window.personaClient.updateState(newState).catch(error => console.log(error));
  };

  window.VICCI.actions.reactTo = (thought) => {
    window.personaClient.reactTo(thought).catch(error => console.log(error));
  };
});
