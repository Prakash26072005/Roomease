import express from "express";
import User from "../models/user.model.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/toggle-favorite/:roomId", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const roomId = req.params.roomId;

    const exists = user.favorites.some(
      (fav) => fav.toString() === roomId
    );

    if (exists) {
      user.favorites = user.favorites.filter(
        (fav) => fav.toString() !== roomId
      );
    } else {
      user.favorites.push(roomId);
    }

    await user.save();

    res.json({
      success: true,
      favorites: user.favorites.map((fav) => fav.toString()), // 👈 important
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get("/favorites", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "favorites",
        populate: {
          path: "owner",
          select: "name",
        },
      });

    res.json({
      success: true,
      rooms: user.favorites,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
export default router;