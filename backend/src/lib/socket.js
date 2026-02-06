import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://chatify-opal-one.vercel.app",
    ],
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

// ✅ userId -> array of socketIds (support multiple logins)
const userSocketMap = {};

// Returns array of socket IDs for a given user
export function getReceiverSocketIds(userId) {
  return userSocketMap[userId] || [];
}

io.on("connection", (socket) => {
  const userId = socket.user._id;
  console.log("🟢 User connected:", socket.user.fullName);

  if (!userSocketMap[userId]) {
    userSocketMap[userId] = [];
  }

  // Add current socket
  userSocketMap[userId].push(socket.id);

  // Broadcast online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.user.fullName);
    if (userSocketMap[userId]) {
      userSocketMap[userId] = userSocketMap[userId].filter(id => id !== socket.id);
      if (userSocketMap[userId].length === 0) {
        delete userSocketMap[userId];
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
