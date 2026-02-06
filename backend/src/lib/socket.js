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

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.user.fullName);
    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
