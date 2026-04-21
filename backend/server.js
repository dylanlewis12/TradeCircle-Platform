import express from 'express';
import { logReq, globalErr } from './middleware/middlewares.js';
import connectDB from './db/conn.js';
// Route Imports
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import tradeRoutes from './routes/tradeRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
// Import socket setup
import { server, io, app } from './lib/socket.js';

// Setups
dotenv.config();
const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

// ✅ CORS Middleware - dynamic for development & production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://tradecircle-frontend.onrender.com',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Other Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logReq);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/messages/", messageRoutes);

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Global Err Middlewares
app.use(globalErr);

// Listener
server.listen(PORT, () => {
  console.log(`✅ Server listening on PORT: ${PORT}`);
  console.log(`✅ Socket.io is ready`);
  console.log(`✅ Allowed origins: ${allowedOrigins.join(', ')}`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});