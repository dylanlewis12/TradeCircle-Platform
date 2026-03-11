import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST"]
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