import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";



// 1️⃣ LOAD ENV FIRST
dotenv.config();

// 2️⃣ CONFIGURE CLOUDINARY AFTER ENV
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 3000;

//  3️⃣ BODY LIMIT (BASE64 IMAGE)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//  4️⃣ CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://chatify-opal-one.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

//  5️⃣ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//  6️⃣ START SERVER
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
