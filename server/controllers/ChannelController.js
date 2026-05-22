import { Channel } from "../models/ChannelModel.js";
import { User } from "../models/UserModel.js";
import { Message } from "../models/MessagesModel.js";

export const createChannel = async (request, response) => {
  try {
    const { name, description, members } = request.body;
    const userId = request.userId;

    if (!name) {
      return response.status(400).send("Channel name is required");
    }

    if (!members || !Array.isArray(members) || members.length === 0) {
      return response.status(400).send("At least one member is required");
    }

    // Admin must be part of members
    const allMembers = [...new Set([userId, ...members])];

    const channel = await Channel.create({
      name,
      description,
      admin: userId,
      members: allMembers,
    });

    const populatedChannel = await Channel.findById(channel._id)
      .populate("admin", "id firstName lastName email image color")
      .populate("members", "id firstName lastName email image color");

    return response.status(201).json({ channel: populatedChannel });
  } catch (error) {
    console.error("Error creating channel:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getUserChannels = async (request, response) => {
  try {
    const userId = request.userId;

    const channels = await Channel.find({
      members: { $in: [userId] },
    })
      .populate("admin", "id firstName lastName email image color")
      .populate("members", "id firstName lastName email image color")
      .sort({ updatedAt: -1 });

    console.log(`📋 Found ${channels.length} channels for user ${userId}`);
    console.log(
      "📋 Channel IDs:",
      channels.map((c) => ({ id: c._id, name: c.name })),
    );

    return response.status(200).json({ channels });
  } catch (error) {
    console.error("Error fetching channels:", error);
    return response.status(500).send("Internal Server Error");
  }
};

export const getChannelMessages = async (request, response) => {
  try {
    const { channelId } = request.params;
    const userId = request.userId;

    console.log("📥 Getting messages for channel:", channelId, "User:", userId);

    const channel = await Channel.findById(channelId);

    if (!channel) {
      console.log("❌ Channel not found:", channelId);
      return response.status(404).send("Channel not found");
    }

    console.log("✅ Channel found:", channel.name, "Members:", channel.members);

    if (!channel.members.includes(userId)) {
      console.log("❌ User not a member:", userId);
      return response.status(403).send("You are not a member of this channel");
    }

    const messages = await Message.find({
      channelId,
      deletedForEveryone: false,
      deletedFor: { $nin: [userId] },
    })
      .populate("sender", "id firstName lastName email image color")
      .sort({ timestamp: 1 });

    console.log("📨 Found", messages.length, "messages for channel", channelId);

    return response.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching channel messages:", error);
    return response.status(500).send("Internal Server Error");
  }
};
