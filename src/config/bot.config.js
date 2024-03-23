import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    
    apiKey:process.env.CHAT_BOT_KEY
});

export default openai;