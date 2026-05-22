import { Server as SocketIOServer } from "socket.io";
import { Message } from "./models/MessagesModel.js";
import { Channel } from "./models/ChannelModel.js";

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

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await Message.create(message);

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id firstName lastName email image color")
      .populate("recipient", "id firstName lastName email image color");

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }
  };

  const sendChannelMessage = async (message) => {
    const { channelId, sender, content, messageType, fileUrl } = message;

    const createdMessage = await Message.create({
      sender,
      content,
      messageType,
      fileUrl,
      timestamp: new Date(),
      channelId,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id firstName lastName email image color")
      .exec();

    const channel = await Channel.findById(channelId).populate("members");

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", messageData);
        }
      });
    }
  };

  const deleteMessageHandler = async (data) => {
    const { messageId, deleteForEveryone, userId } = data;

    try {
      const message = await Message.findById(messageId);

      if (!message) {
        console.error("Message not found:", messageId);
        return;
      }

      if (deleteForEveryone) {
        message.deletedForEveryone = true;

        // Emit to all participants
        if (message.channelId) {
          const channel = await Channel.findById(message.channelId).populate(
            "members",
          );
          channel.members.forEach((member) => {
            const memberSocketId = userSocketMap.get(member._id.toString());
            if (memberSocketId) {
              io.to(memberSocketId).emit("message-deleted", {
                messageId,
                deletedForEveryone: true,
              });
            }
          });
        } else {
          const senderSocketId = userSocketMap.get(message.sender.toString());
          const recipientSocketId = userSocketMap.get(
            message.recipient.toString(),
          );

          if (senderSocketId) {
            io.to(senderSocketId).emit("message-deleted", {
              messageId,
              deletedForEveryone: true,
            });
          }
          if (recipientSocketId) {
            io.to(recipientSocketId).emit("message-deleted", {
              messageId,
              deletedForEveryone: true,
            });
          }
        }
      } else {
        if (!message.deletedFor.includes(userId)) {
          message.deletedFor.push(userId);
        }

        const userSocketId = userSocketMap.get(userId);
        if (userSocketId) {
          io.to(userSocketId).emit("message-deleted", {
            messageId,
            deletedForEveryone: false,
          });
        }
      }

      await message.save();
    } catch (error) {
      console.error("Error deleting message:", error);
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

    socket.on("sendMessage", sendMessage);
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("delete-message", deleteMessageHandler);

    socket.on("disconnect", () => disconnect(socket));
  });

  console.log("🚀 Socket.IO server is ready and listening for connections");
};

export default setupSocket;
