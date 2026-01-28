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
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
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
