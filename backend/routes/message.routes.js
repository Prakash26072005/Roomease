import express from "express";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import mongoose from "mongoose";
const router = express.Router();


// ================= CREATE / GET CONVERSATION =================
router.post("/conversation", verifyToken, async (req, res) => {
  const { receiverId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ message: "Invalid receiverId" });
  }

  try {
    const members = [
      req.user._id.toString(),
      receiverId.toString(),
    ].sort();

    let convo = await Conversation.findOne({
      members: members,
    }).populate("members", "name");

    if (!convo) {
      convo = await Conversation.create({
        members: members,
      });

      convo = await convo.populate("members", "name");
    }

    res.json({ success: true, conversation: convo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


// ================= SEND MESSAGE =================
router.post("/send", verifyToken, async (req, res) => {
  const { receiverId, text } = req.body;

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ message: "Invalid receiverId" });
  }
  try {
    const members = [
      req.user._id.toString(),
      receiverId.toString(),
    ].sort();

    let convo = await Conversation.findOne({
      members: members,
    });

    if (!convo) {
      convo = await Conversation.create({
        members: members,
      });
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
    console.error(err);
    res.status(500).json({ success: false });
  }
});




// ================= GET USER CONVERSATIONS =================
router.get("/conversations/my", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user._id,
    }).populate("members", "name");

    res.json({ success: true, conversations });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

export default router;



// ================= GET MESSAGES =================
router.get("/:conversationId", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});