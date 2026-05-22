import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    image: {
      type: String,
    },
    color: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Channel = mongoose.model("Channels", channelSchema);

export { Channel };
