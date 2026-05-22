import mongoose from "mongoose";
import dotenv from "dotenv";
import { Channel } from "./models/ChannelModel.js";

dotenv.config();

const checkChannels = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ Connected to database");

    const channels = await Channel.find({});

    console.log("\n📊 TOTAL CHANNELS IN DATABASE:", channels.length);
    console.log("=".repeat(80));

    channels.forEach((channel, index) => {
      console.log(`\n${index + 1}. Channel: ${channel.name}`);
      console.log(`   ID: ${channel._id}`);
      console.log(`   Description: ${channel.description || "None"}`);
      console.log(`   Admin ID: ${channel.admin}`);
      console.log(`   Members: ${channel.members.length} members`);
      console.log(`   Created: ${channel.createdAt}`);
      console.log(`   Updated: ${channel.updatedAt}`);
    });

    console.log("\n" + "=".repeat(80));

    const channelNames = channels.map((c) => c.name);
    const duplicateNames = [...new Set(channelNames.filter((name, index) => channelNames.indexOf(name) !== index))];
    
    if (duplicateNames.length > 0) {
      console.log("\n⚠️  DUPLICATE CHANNEL NAMES FOUND:");
      duplicateNames.forEach(name => {
        const dupes = channels.filter(c => c.name === name);
        console.log(`\n   "${name}" appears ${dupes.length} times:`);
        dupes.forEach((d, i) => {
          console.log(`      ${i + 1}. ID: ${d._id} (created: ${d.createdAt})`);
        });
      });
      
      console.log("\n💡 To delete duplicates, keep the oldest and delete the newer ones.");
    } else {
      console.log("\n✅ No duplicate channel names found");
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

checkChannels();
