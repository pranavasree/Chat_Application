import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: function () {
      return this.messageType === "text";
    },
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  timestamp: { type: Date, default: Date.now },

  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },

  fileUrl: {
    type: String,
    required: function () {
      return this.messageType === "file";
    },
  },
});

export const Message = mongoose.model("Message", messageSchema);

export default Message;
