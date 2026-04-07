// models/conversation.model.js
// import mongoose from "mongoose";

// const conversationSchema = new mongoose.Schema(
//   {
//     members: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//       },
//     ],
//     lastMessage: String,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Conversation", conversationSchema);

// models/conversation.model.js
import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// 🔥 IMPORTANT: prevent duplicates (sorted members required)
conversationSchema.index({ members: 1 }, { unique: true });

export default mongoose.model("Conversation", conversationSchema);