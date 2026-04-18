import express from "express";
import Room from "../models/room.model.js";
import upload from "../middlewares/upload.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import cloudinary from "../utils/cloudinary.js";

const router = express.Router();

/* ---------------------- ADD ROOM ---------------------- */
router.post(
  "/add",
  verifyToken,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { title, description, price, address, lat, lng } = req.body;

 const images = req.files?.map((file) => ({
  url: file.path,
  public_id: file.filename
})) || [];


    const room = new Room({
  title,
  description,
  price,
  location: {
    address,
    lat,
    lng,
  },
  images,
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
    const rooms = await Room.find() .populate("owner", "name") .sort({ createdAt: -1 });
    res.json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ---------------------- GET ROOM BY ID ---------------------- */
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate(
      "owner",
      "name email" // only send these fields
    );;

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
/* ---------------------- editroom ---------------------- */
router.put(
  "/edit/:id",
  verifyToken,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);

      if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
      }

      if (!room.owner.equals(req.user._id)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const { title, description, price, address, lat, lng } = req.body;

      // ✅ Safe updates
      if (title) room.title = title;
      if (description) room.description = description;
      if (price) room.price = Number(price);
      if (address) room.location.address = address;
      if (lat) room.location.lat = Number(lat);
      if (lng) room.location.lng = Number(lng);

      // ✅ Images
      if (req.files && req.files.length > 0) {
        for (let img of room.images) {
          if (img.public_id) {
            await cloudinary.uploader.destroy(img.public_id);
          }
        }

        room.images = req.files.map((file) => ({
          url: file.path,
          public_id: file.filename,
        }));
      }

      await room.save();

      res.json({ success: true, room });
    } catch (err) {
      console.error("EDIT ROOM ERROR 👉", err); // 👈 MUST
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    if (room.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Delete images from Cloudinary
    for (let img of room.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // Delete room from DB
    await Room.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Room & images deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


export default router