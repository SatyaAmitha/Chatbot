const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const storeSession = async (messages) => {
  console.log('Storing session with messages:', messages);
  const sessionId = uuidv4();

  // 1. Create the session FIRST
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/chat_sessions`, {
      id: sessionId,
      user_id: uuidv4(), // Or use a real user ID if you have one
    }, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error storing session:', error.response?.data || error.message);
    throw error;
  }

  // 2. Now insert the messages
  for (const message of messages) {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/chat_messages`, {
        session_id: sessionId,
        sender: message.isUser ? 'user' : 'assistant',
        message: message.text,
      }, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error storing user/assistant message:', error.response?.data || error.message);
      throw error;
    }
  }

  return sessionId;
};

async function getSessions() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/chat_sessions`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
}

module.exports = {
  storeSession,
  getSessions
}; 