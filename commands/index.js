import prompt from './prompt';
import actions from './actions';

const config = {
  initialMessage: `Hi, I am Vicky, your computer assistant`,
  prompt,
  actions,
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
}

export default config;
