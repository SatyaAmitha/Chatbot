const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const sendMessage = async (message: string, sessionId?: string) => {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    },
    body: JSON.stringify({ message, sessionId }),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

export const generateImage = async (prompt: string) => {
  const response = await fetch(`${API_BASE_URL}/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error('Failed to generate image');
  return response.json();
};

export const fetchSessions = async () => {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch sessions');
  return response.json();
};

export const fetchMessages = async (sessionId: string) => {
  const response = await fetch(`${API_BASE_URL}/messages/${sessionId}`, {
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
}; 