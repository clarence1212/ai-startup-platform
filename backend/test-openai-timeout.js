const OpenAI = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 10000 // 10 second timeout
});

async function test() {
  console.log('Testing OpenAI key...');
  console.log('Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 15));
  
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hello" }],
      max_tokens: 10
    });
    console.log('Success!', completion.choices[0].message.content);
  } catch (error) {
    console.log('Error type:', error.constructor.name);
    console.log('Error message:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    }
    if (error.code) {
      console.log('Error code:', error.code);
    }
  }
}

test();
