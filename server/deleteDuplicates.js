import mongoose from "mongoose";
import dotenv from "dotenv";
import { Channel } from "./models/ChannelModel.js";
import { Message } from "./models/MessagesModel.js";

dotenv.config();

const deleteDuplicates = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Connected to database");

    // IDs to DELETE (newer duplicates)
    const duplicateIds = [
      "6a04d390d89a0a5f77ff3770",  // 2nd duplicate
      "6a04d40523d9bf7e3c7351bb",  // 3rd duplicate (this one has messages!)
    ];

    // ID to KEEP (oldest)
    const keepId = "6a04d38cd89a0a5f77ff376d";

    console.log("\n🗑️  DELETING DUPLICATE CHANNELS:");
    console.log("   Keeping channel:", keepId);
    console.log("   Deleting:", duplicateIds.join(", "));

    // First, move messages from duplicate channels to the one we're keeping
    for (const dupId of duplicateIds) {
      const messageCount = await Message.countDocuments({ channelId: dupId });
      
      if (messageCount > 0) {
        console.log(`\n📨 Moving ${messageCount} messages from ${dupId} to ${keepId}...`);
        await Message.updateMany(
          { channelId: dupId },
          { $set: { channelId: keepId } }
        );
        console.log(`   ✅ Messages moved!`);
      } else {
        console.log(`\n   No messages in ${dupId}`);
      }
    }

    // Delete the duplicate channels
    const result = await Channel.deleteMany({ _id: { $in: duplicateIds } });
    console.log(`\n✅ Deleted ${result.deletedCount} duplicate channels`);

    // Verify
    const remaining = await Channel.find({});
    console.log(`\n📊 Channels remaining in database: ${remaining.length}`);
    remaining.forEach((c) => {
      console.log(`   - ${c.name} (ID: ${c._id})`);
    });

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

deleteDuplicates();
