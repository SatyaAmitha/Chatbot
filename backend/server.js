const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const { storeUserMessage, callOpenAIChat, storeAssistantMessage } = require('./services/chatService');
const { generateImage } = require('./services/imageService');
const { storeSession, getSessions } = require('./services/sessionService');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

// Middleware to check required environment variables
const checkEnvVariables = () => {
  const requiredVars = [
    'OPENAI_API_KEY',
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars);
    process.exit(1);
  }
};

checkEnvVariables();

console.log('Environment variables loaded:', {
  hasOpenAI: !!process.env.OPENAI_API_KEY,
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});

function handleError(res, error, message) {
  console.error(message, error);
  const statusCode = error.response?.status || 500;
  const errorMessage = error.response?.data?.error || message;
  res.status(statusCode).json({ error: errorMessage });
}

// Authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Apply authentication middleware to all routes
app.use(authenticate);

app.post('/chat', async (req, res) => {
  try {
    const userInput = req.body.input;
    if (!userInput) {
      return res.status(400).json({ error: 'Input is required' });
    }

    // Use existing session ID or create a new session
    let sessionId = req.body.sessionId;
    if (!sessionId) {
      // Create a new session in the database first
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/chat_sessions`, {
          user_id: uuidv4(), // For now, create a new user ID for each session
        }, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
        });
        sessionId = response.data[0].id;
      } catch (error) {
        console.error('Error creating chat session:', error);
        throw error;
      }
    }

    // Now store the message and get the reply
    await storeUserMessage(userInput, sessionId);
    const reply = await callOpenAIChat(userInput);
    await storeAssistantMessage(reply, sessionId);
    
    res.json({ reply, sessionId });
  } catch (error) {
    handleError(res, error, 'Failed to process chat request');
  }
});

app.post('/generate-image', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const imageUrl = await generateImage(prompt);
    res.json({ imageUrl });
  } catch (error) {
    handleError(res, error, 'Failed to generate image with OpenAI');
  }
});

app.get('/store-session', async (req, res) => {
  try {
    const sessions = await getSessions();
    res.json(sessions);
  } catch (error) {
    handleError(res, error, 'Failed to fetch sessions from Supabase');
  }
});

app.post('/store-session', async (req, res) => {
  try {
    const messages = req.body.messages;
    if (!messages) {
      return res.status(400).json({ error: 'Messages are required' });
    }

    const sessionId = await storeSession(messages);
    res.status(200).json({ message: 'Session stored successfully', sessionId });
  } catch (error) {
    handleError(res, error, 'Failed to store session in Supabase');
  }
});

app.get('/messages/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/chat_messages?session_id=eq.${sessionId}&order=created_at.asc`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
    });
    res.json(response.data);
  } catch (error) {
    handleError(res, error, 'Failed to fetch messages for session');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 