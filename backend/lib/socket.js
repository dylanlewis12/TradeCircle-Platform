import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

// Keep in sync with backend/server.js allowedOrigins (Socket.IO handles its own CORS for polling)
const allowedSocketOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://tradecircle-frontend.onrender.com",
  process.env.FRONTEND_URL,
].filter(Boolean);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedSocketOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

// Store online users
const userSocketMap = {};

// Socket.io connection
io.on("connection", (socket) => {
  console.log("👤 A user connected", socket.id);
  
  // Get userId from query
  const userId = socket.handshake.query.userId;
  console.log('🔑 UserId from query:', userId);
  
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log('USER MAPPED:', userId, '->', socket.id);
  }

  // Also handle userOnline event
  socket.on('userOnline', (id) => {
    userSocketMap[id] = socket.id;
    console.log('✅ User online via event:', id, '->', socket.id);
    io.emit('getOnlineUsers', Object.keys(userSocketMap));
  });

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    for (let [id, socketId] of Object.entries(userSocketMap)) {
      if (socketId === socket.id) {
        delete userSocketMap[id];
        console.log("User removed:", id);
        break;
      }
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server, userSocketMap };
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}