import { Server as SocketIOServer } from "socket.io";

const setupSocket = (server) => {
  // Parse ORIGIN from .env - it can be a JSON array string or comma-separated string
  let allowedOrigins;
  try {
    allowedOrigins = JSON.parse(process.env.ORIGIN);
  } catch {
    // If not valid JSON, split by comma
    allowedOrigins = process.env.ORIGIN.split(",").map((origin) =>
      origin.trim(),
    );
  }

  const io = new SocketIOServer(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log("🔌 Socket disconnected:", socket.id);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log("✅ Socket connected:", socket.id, "for user:", userId);
    } else {
      console.log("⚠️  UserID not provided for connection");
    }

    socket.on("disconnect", () => disconnect(socket));
  });

  console.log("🚀 Socket.IO server is ready and listening for connections");
};

export default setupSocket;
