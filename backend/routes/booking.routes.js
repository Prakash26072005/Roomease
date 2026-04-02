// routes/booking.routes.js
import express from "express";
import Booking from "../models/booking.model.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = express.Router();


router.get("/my-bookings", verifyToken, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("room")
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
});

export default router;
