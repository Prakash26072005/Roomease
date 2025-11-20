import express from "express";
import Room from "../models/room.model.js";
import upload from "../middlewares/upload.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ---------------------- ADD ROOM ---------------------- */
router.post(
  "/add",
  verifyToken,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const { title, description, price, location } = req.body;

      const imageUrls = req.files?.map((file) => file.path) || [];

      const room = new Room({
        title,
        description,
        price,
        location,
        images: imageUrls,
        owner: req.user._id,
      });

      await room.save();

      res.status(201).json({ success: true, room });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.get("/my-rooms", verifyToken, async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


/* ---------------------- GET ALL ROOMS ---------------------- */
router.get("/all", async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------------- GET ROOM BY ID ---------------------- */
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put(
  "/edit/:id",
  verifyToken,
  upload.array("images", 5),
  async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);

      // If room not found
      if (!room) {
        return res
          .status(404)
          .json({ success: false, message: "Room not found" });
      }

      // Check owner
      if (room.owner.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ success: false, message: "Not authorized" });
      }

      const { title, description, price, location } = req.body;

      let imageUrls = room.images;
      if (req.files.length > 0) {
        imageUrls = req.files.map((file) => file.path);
      }

      room.title = title;
      room.description = description;
      room.price = price;
      room.location = location;
      room.images = imageUrls;

      await room.save();

      res.json({ success: true, room });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // Check owner
    if (room.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    await Room.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router