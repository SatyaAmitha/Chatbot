const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const storeUserMessage = async (userInput, sessionId) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/chat_messages`, {
      session_id: sessionId,
      sender: 'user',
      message: userInput,
    }, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error storing user message:', error);
    throw error;
  }
};

const callOpenAIChat = async (userInput) => {
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'user', content: userInput }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

const storeAssistantMessage = async (reply, sessionId) => {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/chat_messages`, {
      session_id: sessionId,
      sender: 'assistant',
      message: reply,
    }, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error storing assistant message:', error);
    throw error;
  }
};

module.exports = {
  storeUserMessage,
  callOpenAIChat,
  storeAssistantMessage,
}; 