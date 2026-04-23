import express from "express";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import mongoose from "mongoose";

const router = express.Router();

// helper 🔥
const getSortedMembers = (id1, id2) => {
  return [id1.toString(), id2.toString()].sort();
};

// ================= CREATE / GET CONVERSATION =================
router.post("/conversation", verifyToken, async (req, res) => {
  const { receiverId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ message: "Invalid receiverId" });
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
   const members = getSortedMembers(req.user._id, receiverId);

let convo = await Conversation.findOne({
  members: { $all: members, $size: 2 },
}).populate("members", "name");

if (!convo) {
  try {
    convo = await Conversation.create({ members });
    convo = await convo.populate("members", "name");
  } catch (err) {
    if (err.code === 11000) {
      convo = await Conversation.findOne({
        members: { $all: members, $size: 2 },
      }).populate("members", "name");
    } else {
      throw err;
    }
  }
}

    res.json({ success: true, conversation: convo });

  } catch (err) {
    console.error("CONVERSATION ERROR FULL 👉", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// ================= SEND MESSAGE =================
router.post("/send", verifyToken, async (req, res) => {
  const { receiverId, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ message: "Invalid receiverId" });
  }

  try {
    const members = getSortedMembers(req.user._id, receiverId);

    let convo;

    try {
     convo = await Conversation.findOne({
  members: { $all: members, $size: 2 },
});

      if (!convo) {
        convo = await Conversation.create({ members });
      }
    } catch (err) {
     if (err.code === 11000) {
  convo = await Conversation.findOne({
    members: { $all: members, $size: 2 }, // ✅ FIX
  });
      } else {
        throw err;
      }
    }

    const message = await Message.create({
      conversationId: convo._id,
      sender: req.user._id,
      text,
    });

    convo.lastMessage = text;
    await convo.save();

    res.json({ success: true, message });
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

// ================= GET USER CONVERSATIONS =================
router.get("/conversations/my", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user._id,
    })
      .populate("members", "name")
      .sort({ updatedAt: -1 });

    res.json({ success: true, conversations });
  } catch (err) {
    console.error("GET CONVERSATIONS ERROR:", err);
    res.status(500).json({ success: false });
  }
});

// ================= GET MESSAGES =================
router.get("/:conversationId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    res.status(500).json({ success: false });
  }
});

export default router;
