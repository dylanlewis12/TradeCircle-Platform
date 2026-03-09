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
//const app = server.app || express();
const PORT = process.env.PORT || 3000;
const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

// Connect to DB
connectDB();

// CORS Middleware - only ONE call
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
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

// Global Err Middlewares
app.use(globalErr);

//Listener
server.listen(PORT, () => {
  console.log(`✅ Server listening on PORT: ${PORT}`);
  console.log(`✅ Socket.io is ready`);
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

/*
app.listen(PORT, () => {
  console.log(`✅ Server listening on PORT: ${PORT}`);
  console.log(`✅ Socket.io is ready`);
});
*/