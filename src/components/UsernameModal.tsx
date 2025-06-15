import React, { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';

interface UsernameModalProps {
  onSetUsername: (username: string) => void;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({ onSetUsername }) => {
  const [username, setUsername] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSetUsername(username.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Chat</h2>
          <p className="text-gray-600">Choose a username to get started</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <input
              ref={inputRef}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
              maxLength={20}
            />
          </div>
          
          <button
            type="submit"
            disabled={!username.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            Join Chat
          </button>
        </form>
      </div>
    </div>
  );
};