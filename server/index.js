import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import coupleRoutes from './routes/couples.js';
import messageRoutes from './routes/messages.js';
import quoteRoutes from './routes/quotes.js';
import moodRoutes from './routes/mood.js';
import spicyRoutes from './routes/spicy.js';
import Message from './models/Message.js';
import { setupSocketHandlers } from './socket/handlers.js';

dotenv.config({ path: new URL('./.env', import.meta.url).pathname });

console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET');
console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/couples', coupleRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/spicy', spicyRoutes);

// Socket.io setup
setupSocketHandlers(io);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/couplesconnect';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    // Delete messages older than 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const result = await Message.deleteMany({
      timestamp: { $lt: sevenDaysAgo },
      type: { $nin: ['hug'] }
    });
    console.log(`Deleted ${result.deletedCount} messages older than 7 days`);
  })
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
