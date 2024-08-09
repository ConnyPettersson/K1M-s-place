import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
console.log('Loaded API Key:', apiKey);

if (!apiKey) {
  throw new Error('Missing OpenAI key in environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey,
});

export default openai;
