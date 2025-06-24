import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
});

export async function sendMessage(input: string, sessionId?: string) {
  try {
    const response = await api.post('/chat', { input, sessionId });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export const generateImage = async (prompt: string) => {
  try {
    const response = await api.post('/generate-image', {
      prompt,
    });
    return response.data;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};

export async function fetchSessions() {
  try {
    const response = await api.get('/store-session');
    return response.data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    throw error;
  }
}

export async function fetchMessages(sessionId: string) {
  try {
    const response = await api.get(`/messages/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
} 