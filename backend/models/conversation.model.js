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

// 🔥 ensure sorted uniqueness
conversationSchema.pre("save", function (next) {
  this.members = this.members.sort();
  next();
});

conversationSchema.index({ members: 1 }, { unique: true });

export default mongoose.model("Conversation", conversationSchema);