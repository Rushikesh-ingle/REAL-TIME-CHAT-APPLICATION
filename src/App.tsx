import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { ChatMessage } from './components/ChatMessage';
import { MessageInput } from './components/MessageInput';
import { UserList } from './components/UserList';
import { TypingIndicator } from './components/TypingIndicator';
import { ConnectionStatus } from './components/ConnectionStatus';
import { UsernameModal } from './components/UsernameModal';
import { MessageCircle, Menu, X } from 'lucide-react';

const WEBSOCKET_URL = 'ws://localhost:8080';

function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    isConnected,
    messages,
    users,
    typingUsers,
    clientId,
    sendChatMessage,
    setUsername: wsSetUsername,
    sendTyping
  } = useWebSocket(WEBSOCKET_URL);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSetUsername = (newUsername: string) => {
    setUsername(newUsername);
    wsSetUsername(newUsername);
  };

  const handleSendMessage = (message: string) => {
    sendChatMessage(message);
  };

  const handleTyping = (isTyping: boolean) => {
    sendTyping(isTyping);
  };

  if (!username) {
    return <UsernameModal onSetUsername={handleSetUsername} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageCircle size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Real-time Chat</h1>
                <p className="text-sm text-gray-600">
                  {users.length} {users.length === 1 ? 'user' : 'users'} online
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ConnectionStatus isConnected={isConnected} />
              <button
                onClick={() => setShowUserList(!showUserList)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {showUserList ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Start the conversation!</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwnMessage={message.userId === clientId}
              />
            ))
          )}
          <TypingIndicator typingUsers={typingUsers} />
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          disabled={!isConnected}
        />
      </div>

      {/* User List - Desktop */}
      <div className="hidden lg:block">
        <UserList users={users} currentUserId={clientId} />
      </div>

      {/* User List - Mobile Overlay */}
      {showUserList && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
            <UserList users={users} currentUserId={clientId} />
          </div>
          <div
            className="absolute inset-0"
            onClick={() => setShowUserList(false)}
          />
        </div>
      )}
    </div>
  );
}

export default App;