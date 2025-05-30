const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // frontend port (vite)
    methods: ['GET', 'POST']
  }
});

// Fake stock data stream
function generateFakeData() {
  const stocks = ['PCBL', 'TATASTEEL', 'RELIANCE', 'TRANSRAIL'];
  const stock = stocks[Math.floor(Math.random() * stocks.length)];
  const bid = Math.floor(Math.random() * 100000) + 50000;
  const offer = Math.floor(Math.random() * 100000) + 50000;

  let message = '';
  if (bid > 2 * offer) {
    message = 'Bid > 2x Offer';
  } else if (offer > 2 * bid) {
    message = 'Offer > 2x Bid';
  } else {
    return null;
  }

  return {
    stock,
    bid,
    offer,
    message,
    timestamp: Date.now()
  };
}

io.on('connection', (socket) => {
  console.log('⚡ Client connected');

  const interval = setInterval(() => {
    const alert = generateFakeData();
    if (alert) {
      socket.emit('alert', alert);
    }
  }, 3000); // every 3 seconds

  socket.on('disconnect', () => {
    console.log('🚪 Client disconnected');
    clearInterval(interval);
  });
});

server.listen(4000, () => {
  console.log('✅ Socket server running on http://localhost:4000');
});
