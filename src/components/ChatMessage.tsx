import React from 'react';
import { Message } from '../types/chat';
import { formatTime } from '../utils/dateUtils';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isOwnMessage }) => {
  if (message.type === 'system') {
    return (
      <div className="flex justify-center mb-4">
        <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        {!isOwnMessage && (
          <div className="text-sm text-gray-600 mb-1 ml-2">
            {message.username}
          </div>
        )}
        <div
          className={`px-4 py-2 rounded-2xl shadow-sm ${
            isOwnMessage
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          <div
            className={`text-xs mt-1 ${
              isOwnMessage ? 'text-blue-100' : 'text-gray-500'
            }`}
          >
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
};