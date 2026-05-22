import { User } from "../models/UserModel.js";
import { Message } from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const uploadFile = async (request, response) => {
  try {
    if (!request.file) {
      return response.status(400).send("File is required");
    }

    const date = Date.now();
    const fileDir = `uploads/files/${date}`;
    const fileName = `${fileDir}/${request.file.originalname}`;

    // Create directory if it doesn't exist
    mkdirSync(fileDir, { recursive: true });

    // Move file to the new directory
    renameSync(request.file.path, fileName);

    return response.status(200).json({ filePath: fileName });
  } catch (error) {
    console.error("Upload file error:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getMessages = async (request, response) => {
  try {
    const user1 = request.userId;
    const user2 = request.body.userId;

    if (!user2 || !user1) {
      return response.status(400).send("Both User IDs are required");
    }

    // Find all messages where user1 and user2 are either sender or recipient
    // Exclude messages deleted for everyone or deleted for current user
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
      deletedForEveryone: false,
      deletedFor: { $nin: [user1] },
    })
      .populate("sender", "id firstName lastName email image color")
      .populate("recipient", "id firstName lastName email image color")
      .sort({ timestamp: 1 });

    return response.status(200).json({ messages });
  } catch (error) {
    console.error("Get messages error:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const deleteMessage = async (request, response) => {
  try {
    const { messageId, deleteForEveryone } = request.body;
    const userId = request.userId;

    if (!messageId) {
      return response.status(400).send("Message ID is required");
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return response.status(404).send("Message not found");
    }

    // Only sender can delete for everyone
    if (deleteForEveryone) {
      if (message.sender.toString() !== userId) {
        return response
          .status(403)
          .send("You can only delete your own messages for everyone");
      }
      message.deletedForEveryone = true;
    } else {
      // Delete for me
      if (!message.deletedFor.includes(userId)) {
        message.deletedFor.push(userId);
      }
    }

    await message.save();

    return response.status(200).json({
      success: true,
      message: deleteForEveryone
        ? "Message deleted for everyone"
        : "Message deleted for you",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    return response.status(500).send("Internal Server Error");
  }
};
