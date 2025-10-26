import nitrolite from '@erc7824/nitrolite';
import WebSocket from 'ws';

const { createAppSessionMessage, parseRPCResponse } = nitrolite;

// Connect to Yellow Network
const ws = new WebSocket('wss://clearnet.yellow.com/ws');

ws.on('open', () => {
  console.log('✅ Connected to Yellow Network!');
});

ws.on('message', (data) => {
  try {
    const message = parseRPCResponse(typeof data === 'string' ? data : data.toString());
    console.log('📨 Received:', message);
  } catch (err) {
    console.error('Failed to parse message:', err);
  }
});

ws.on('error', (error) => {
  console.error('Connection error:', error);
});

console.log('Connecting to Yellow Network...');