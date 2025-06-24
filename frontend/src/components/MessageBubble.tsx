import React from 'react';

interface MessageBubbleProps {
  message: string;
  isUser: boolean;
  isImage?: boolean;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser, isImage = false, className = '' }) => {
  return (
    <div
      className={`p-4 rounded-lg ${
        isUser
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 text-gray-100'
      } ${className}`}
    >
      {isImage ? (
        <img src={message} alt="Generated" className="max-w-xs rounded-lg" />
      ) : (
        <p className="break-words">{message}</p>
      )}
    </div>
  );
}; 