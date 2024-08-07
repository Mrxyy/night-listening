import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google'


export const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export const gemini = createGoogleGenerativeAI({apiKey:process.env.API_KEY});

const model = groq('llama-3.1-70b-versatile');

export default model;
