import { useEffect, useRef, useState, useCallback } from 'react';
import { Message, User, TypingUser } from '../types/chat';

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const typingTimeout = useRef<NodeJS.Timeout>();

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
        setTypingUsers([]);
        
        // Attempt to reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      setIsConnected(false);
    }
  }, [url]);

  const handleMessage = (data: any) => {
    switch (data.type) {
      case 'connection':
        setClientId(data.clientId);
        if (data.messageHistory) {
          setMessages(data.messageHistory);
        }
        break;
      
      case 'message':
      case 'system':
        setMessages(prev => [...prev, data]);
        break;
      
      case 'userList':
        setUsers(data.users);
        break;
      
      case 'typing':
        setTypingUsers(prev => {
          const filtered = prev.filter(user => user.userId !== data.userId);
          if (data.isTyping) {
            return [...filtered, { userId: data.userId, username: data.username }];
          }
          return filtered;
        });
        break;
    }
  };

  const sendMessage = useCallback((message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  const sendChatMessage = useCallback((content: string) => {
    sendMessage({
      type: 'chatMessage',
      content
    });
  }, [sendMessage]);

  const setUsername = useCallback((username: string) => {
    sendMessage({
      type: 'setUsername',
      username
    });
  }, [sendMessage]);

  const sendTyping = useCallback((isTyping: boolean) => {
    sendMessage({
      type: 'typing',
      isTyping
    });
  }, [sendMessage]);

  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  return {
    isConnected,
    messages,
    users,
    typingUsers,
    clientId,
    sendChatMessage,
    setUsername,
    sendTyping
  };
};