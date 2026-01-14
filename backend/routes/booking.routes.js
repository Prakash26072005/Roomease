// routes/booking.routes.js
import express from "express";
import Booking from "../models/booking.model.js";

const router = express.Router();

router.get("/my-bookings/:userId", async (req, res) => {
  const bookings = await Booking.find({ user: req.params.userId })
    .populate("room")
    .sort({ createdAt: -1 });

  res.json({ success: true, bookings });
});

export default router;
