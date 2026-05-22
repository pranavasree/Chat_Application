import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoutes.js";
import channelRoutes from "./routes/ChannelRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 30001;
const databaseUrl = process.env.DATABASE_URL;

// CORS must be first - handle all origins properly
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Cookie",
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Serve uploaded files
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use("/api/auth", authRoutes);

app.use("/api/contacts", contactRoutes);

app.use("/api/messages", messagesRoutes);

app.use("/api/channels", channelRoutes);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

setupSocket(server);

mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((err) => {
    console.log("❌ Database connection error:", err.message);
    console.log("\n📝 Please check your MongoDB Atlas setup:");
    console.log("   1. Make sure you've created a cluster on MongoDB Atlas");
    console.log(
      "   2. Update DATABASE_URL in .env with your connection string",
    );
    console.log(
      "   3. Replace <username> and <password> with your credentials",
    );
    console.log("   4. Whitelist your IP address in Network Access");
    console.log("\n📖 See MONGODB_ATLAS_SETUP.md for detailed instructions\n");
  });
