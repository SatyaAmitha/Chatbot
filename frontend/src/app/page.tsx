"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "../components/ui/button";
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { ModeToggle } from '../components/ModeToggle';
import { sendMessage, generateImage, fetchSessions, fetchMessages } from '../api/chatService';

interface Message {
  text: string;
  isUser: boolean;
  isImage?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pastSessions, setPastSessions] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await fetchSessions();
        setPastSessions(data);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };
    loadSessions();
  }, []);

  const handleSend = async (message: string) => {
    setError(null); // Clear previous errors
    setLoading(true); // Start loading
    try {
      if (mode === 'text') {
        // Add the user's message first
        setMessages([...messages, { text: message, isUser: true }]);
        const data = await sendMessage(message, sessionId);
        // Then add the AI's reply
        setMessages(prev => [...prev, { text: data.reply, isUser: false }]);
      } else if (mode === 'image') {
        // Add the user's prompt first
        setMessages([...messages, { text: message, isUser: true }]);
        const data = await generateImage(message);
        // Then add the AI's image response
        setMessages(prev => [...prev, { text: data.imageUrl, isUser: false, isImage: true }]);
      }
    } catch (error) {
      console.error('Error handling send:', error);
      setError('Failed to process request. Please try again.');
    }
    setLoading(false); // End loading
  };

  const toggleMode = () => {
    setMode((prevMode: 'text' | 'image') => (prevMode === 'text' ? 'image' : 'text'));
  };

  const handleNewChat = async () => {
    // Optionally store the old session in Supabase
    if (messages.length > 0) {
      try {
        await fetch('http://localhost:8000/store-session', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          }),
          body: JSON.stringify({ messages: messages.map(m => ({ text: m.text, isUser: m.isUser })) }),
        });
      } catch (error) {
        console.error('Error storing session:', error);
      }
    }

    // Clear the current chat UI
    setMessages([]);
  };

  // Add this function to handle session selection
  const handleSessionSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSessionId = e.target.value;
    setSessionId(selectedSessionId);
    if (selectedSessionId) {
      try {
        const msgs = await fetchMessages(selectedSessionId);
        // Map Supabase messages to Message[]
        setMessages(msgs.map((msg: any) => ({
          text: msg.message,
          isUser: msg.sender === 'user',
          isImage: false // You can enhance this if you store image info
        })));
      } catch (err) {
        setError('Failed to load messages for this session.');
      }
    } else {
      setMessages([]);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        <header className="flex justify-between items-center mb-8 py-4 border-b border-gray-700">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            AI Chat Assistant
          </h1>
          <div className="flex gap-4 items-center">
            {/* Dropdown for previous sessions */}
            <select
              className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 mr-2"
              value={sessionId}
              onChange={handleSessionSelect}
            >
              <option value="">Select Previous Chat</option>
              {pastSessions.map((session: any) => (
                <option key={session.id} value={session.id}>
                  {session.id.slice(0, 8)}... {session.created_at ? new Date(session.created_at).toLocaleString() : ''}
                </option>
              ))}
            </select>
            <Button
              onClick={handleNewChat}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              New Chat
            </Button>
            <ModeToggle mode={mode} onToggle={toggleMode} />
          </div>
        </header>

        <div className="flex-1 overflow-auto mb-4 space-y-4">
          {messages.map((message: Message, index: number) => (
            <MessageBubble
              key={index}
              message={message.text}
              isUser={message.isUser}
              isImage={message.isImage}
              className={`max-w-[80%] ${message.isUser ? 'ml-auto' : 'mr-auto'}`}
            />
          ))}
          {loading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-900/50 backdrop-blur-lg pt-4">
          <ChatInput 
            onSend={handleSend} 
            disabled={loading}
            className="bg-gray-800 border border-gray-700 rounded-lg"
          />
        </div>
      </div>
    </main>
  );
}
