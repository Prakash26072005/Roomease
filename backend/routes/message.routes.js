import express from "express";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();


// 🔥 SEND MESSAGE
router.post("/send", verifyToken, async (req, res) => {
  const { receiverId, text } = req.body;

  try {
    // 1️⃣ find or create conversation
    let convo = await Conversation.findOne({
      members: { $all: [req.user._id, receiverId] },
    });

    if (!convo) {
      convo = await Conversation.create({
        members: [req.user._id, receiverId],
      });
    }

    // 2️⃣ save message
    const message = await Message.create({
      conversationId: convo._id,
      sender: req.user._id,
      text,
    });

    // 3️⃣ update last message
    convo.lastMessage = text;
    await convo.save();

    res.json({ success: true, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


// 🔥 GET MESSAGES (RIGHT PANEL)
router.get("/:conversationId", verifyToken, async (req, res) => {
  const messages = await Message.find({
    conversationId: req.params.conversationId,
  });

  res.json({ success: true, messages });
});


// 🔥 GET USER CONVERSATIONS (LEFT PANEL)
router.get("/conversations/my", verifyToken, async (req, res) => {
  const conversations = await Conversation.find({
    members: req.user._id,
  }).populate("members", "name");

  res.json({ success: true, conversations });
});

export default router;