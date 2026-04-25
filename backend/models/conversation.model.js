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
    membersKey: {
      type: String,
      unique: true,
      sparse: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// 🔥 ensure sorted uniqueness
conversationSchema.pre("save", function (next) {
  this.members = this.members.map((member) => member.toString()).sort();
  this.membersKey = this.members.join("_");
  next();
});

conversationSchema.index({ membersKey: 1 }, { unique: true, sparse: true });

export default mongoose.model("Conversation", conversationSchema);
