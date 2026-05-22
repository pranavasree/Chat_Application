import mongoose from "mongoose";
import dotenv from "dotenv";
import { Channel } from "./models/ChannelModel.js";
import { Message } from "./models/MessagesModel.js";
import { User } from "./models/UserModel.js";

dotenv.config();

const viewDatabase = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Connected to MongoDB Atlas");
    console.log("📊 Database:", mongoose.connection.name);
    console.log("=".repeat(80));

    // Count documents in each collection
    const userCount = await User.countDocuments();
    const channelCount = await Channel.countDocuments();
    const messageCount = await Message.countDocuments();

    console.log("\n📈 COLLECTION COUNTS:");
    console.log(`   Users: ${userCount}`);
    console.log(`   Channels: ${channelCount}`);
    console.log(`   Messages: ${messageCount}`);

    // Show all users
    console.log("\n👥 USERS:");
    console.log("=".repeat(80));
    const users = await User.find({});
    users.forEach((user, i) => {
      console.log(`\n${i + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Profile Setup: ${user.profileSetup ? "✅" : "❌"}`);
    });

    // Show all channels
    console.log("\n\n💬 CHANNELS:");
    console.log("=".repeat(80));
    const channels = await Channel.find({});

    if (channels.length === 0) {
      console.log("❌ No channels found in database");
    } else {
      for (const channel of channels) {
        const msgCount = await Message.countDocuments({
          channelId: channel._id,
        });
        console.log(`\n📢 ${channel.name}`);
        console.log(`   ID: ${channel._id}`);
        console.log(`   Description: ${channel.description || "None"}`);
        console.log(`   Admin: ${channel.admin}`);
        console.log(`   Members: ${channel.members.length}`);
        console.log(`   Messages: ${msgCount}`);
        console.log(`   Created: ${channel.createdAt}`);
      }
    }

    // Show message summary
    console.log("\n\n📨 MESSAGES SUMMARY:");
    console.log("=".repeat(80));
    const dmCount = await Message.countDocuments({
      recipient: { $exists: true, $ne: null },
    });
    const channelMsgCount = await Message.countDocuments({
      channelId: { $exists: true, $ne: null },
    });
    console.log(`   Direct Messages: ${dmCount}`);
    console.log(`   Channel Messages: ${channelMsgCount}`);

    console.log("\n" + "=".repeat(80));
    console.log("\n✅ To view in browser, go to: https://cloud.mongodb.com/");
    console.log("   Click 'Browse Collections' on your Cluster0\n");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

viewDatabase();
