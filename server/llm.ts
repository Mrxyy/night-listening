import { createOpenAI } from '@ai-sdk/openai';

export const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

const model = groq('llama-3.1-70b-versatile');
export default model;