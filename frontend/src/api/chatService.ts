const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const sendMessage = async (message: string, sessionId?: string) => {
  const response = await fetch(`/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, sessionId }),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

export const generateImage = async (prompt: string) => {
  const response = await fetch(`/api/generate-image`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  if (!response.ok) throw new Error('Failed to generate image');
  return response.json();
};

export const fetchSessions = async () => {
  const response = await fetch(`/api/sessions`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch sessions');
  return response.json();
};

export const fetchMessages = async (sessionId: string) => {
  const response = await fetch(`/api/messages/${sessionId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to fetch messages');
  return response.json();
}; 