import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

// Store connected clients and message history
const clients = new Map();
const messageHistory = [];
const MAX_HISTORY = 100;

console.log(`WebSocket server running on port ${PORT}`);

wss.on('connection', (ws) => {
  const clientId = uuidv4();
  
  console.log(`Client ${clientId} connected`);
  
  // Store client connection
  clients.set(clientId, {
    ws,
    id: clientId,
    username: null,
    joinedAt: new Date().toISOString()
  });

  // Send connection confirmation and message history
  ws.send(JSON.stringify({
    type: 'connection',
    clientId,
    messageHistory: messageHistory.slice(-50) // Send last 50 messages
  }));

  // Send updated user list to all clients
  broadcastUserList();

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      handleMessage(clientId, message);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    clients.delete(clientId);
    broadcastUserList();
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for client ${clientId}:`, error);
  });
});

function handleMessage(clientId, message) {
  const client = clients.get(clientId);
  if (!client) return;

  switch (message.type) {
    case 'setUsername':
      client.username = message.username;
      broadcastUserList();
      
      // Send welcome message
      const welcomeMsg = {
        id: uuidv4(),
        type: 'system',
        content: `${message.username} joined the chat`,
        timestamp: new Date().toISOString()
      };
      addToHistory(welcomeMsg);
      broadcast(welcomeMsg);
      break;

    case 'chatMessage':
      if (client.username && message.content.trim()) {
        const chatMessage = {
          id: uuidv4(),
          type: 'message',
          content: message.content,
          username: client.username,
          userId: clientId,
          timestamp: new Date().toISOString()
        };
        addToHistory(chatMessage);
        broadcast(chatMessage);
      }
      break;

    case 'typing':
      // Broadcast typing indicator to other users
      const typingMessage = {
        type: 'typing',
        username: client.username,
        userId: clientId,
        isTyping: message.isTyping
      };
      broadcastToOthers(clientId, typingMessage);
      break;
  }
}

function addToHistory(message) {
  messageHistory.push(message);
  if (messageHistory.length > MAX_HISTORY) {
    messageHistory.shift();
  }
}

function broadcast(message) {
  const messageStr = JSON.stringify(message);
  clients.forEach((client) => {
    if (client.ws.readyState === 1) { // WebSocket.OPEN
      client.ws.send(messageStr);
    }
  });
}

function broadcastToOthers(excludeClientId, message) {
  const messageStr = JSON.stringify(message);
  clients.forEach((client, clientId) => {
    if (clientId !== excludeClientId && client.ws.readyState === 1) {
      client.ws.send(messageStr);
    }
  });
}

function broadcastUserList() {
  const userList = Array.from(clients.values())
    .filter(client => client.username)
    .map(client => ({
      id: client.id,
      username: client.username,
      joinedAt: client.joinedAt
    }));

  broadcast({
    type: 'userList',
    users: userList
  });
}

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  wss.close(() => {
    process.exit(0);
  });
});