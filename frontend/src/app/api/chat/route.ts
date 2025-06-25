import { NextResponse } from 'next/server';
import { callOpenAIChat } from './chatService';

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const reply = await callOpenAIChat(message);
    
    return NextResponse.json({ reply, sessionId });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 