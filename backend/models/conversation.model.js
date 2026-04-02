// models/conversation.model.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: String,
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);