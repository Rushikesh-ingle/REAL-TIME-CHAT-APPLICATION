export interface Message {
  id: string;
  type: 'message' | 'system';
  content: string;
  username?: string;
  userId?: string;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  joinedAt: string;
}

export interface TypingUser {
  userId: string;
  username: string;
}