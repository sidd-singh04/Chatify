// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware.js";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173",
//       "http://localhost:5174",
//       "https://chatify-opal-one.vercel.app",
//     ],
//     credentials: true,
//   },
// });

// io.use(socketAuthMiddleware);

// export function getReceiverSocketId(userId){
//     return userSocketMap[userId]
// }

// const userSocketMap = {};

// io.on("connection", (socket) => {
//   console.log("🟢 User connected:", socket.user.fullName);

//   const userId = socket.userId;
//   userSocketMap[userId] = socket.id;

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("🔴 User disconnected:", socket.user.fullName);
//     delete userSocketMap[userId];

//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };


import { Server } from "socket.io";
import http from "http";
import express from "express";
import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware.js";

const app = express();
const server = http.createServer(app);

// CORS and Socket.IO setup
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

// Apply authentication middleware
io.use(socketAuthMiddleware);

// Map to store online users and their socket IDs
const userSocketMap = {};

// Helper function to get receiver socket
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Socket connection
io.on("connection", (socket) => {
  const userId = socket.userId;
  const userName = socket.user.fullName;

  // Save user's socket ID
  userSocketMap[userId] = socket.id;

  console.log("🟢 User connected:", userName);

  // Notify all clients of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Listen for messages from client
  socket.on("sendMessage", (message) => {
    const receiverSocketId = userSocketMap[message.receiverId];
    if (receiverSocketId) {
      // Emit message only to the receiver
      io.to(receiverSocketId).emit("newMessage", message);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", userName);
    delete userSocketMap[userId];

    // Update all clients about online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
