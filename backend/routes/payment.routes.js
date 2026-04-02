import express from "express";
import crypto from "crypto";
import razorpay from "../utils/razorpay.js";
import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

/* ================= CREATE ORDER ================= */
router.post("/create-order", verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res
        .status(400)
        .json({ success: false, message: "Amount required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // ₹ → paise
      currency: "INR",
    });

    res.json({ success: true, order });
  } catch (err) {
    console.error("Create Order Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Order creation failed" });
  }
});

/* ================= VERIFY PAYMENT ================= */
router.post("/verify", verifyToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      roomId,
      startDate,
    } = req.body;

    // ================= SIGNATURE VERIFY =================
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // ================= FETCH DATA =================
    const room = await Room.findById(roomId).populate("owner");
    const user = req.user; // 🔥 from JWT cookie

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    // ================= DUPLICATE BOOKING CHECK =================
    const existingBooking = await Booking.findOne({
      room: room._id,
      user: user._id,
    });

    if (existingBooking) {
      return res.json({
        success: true,
        message: "Already booked",
        booking: existingBooking,
      });
    }

    // ================= CREATE BOOKING =================
    const booking = await Booking.create({
      room: room._id,
      user: user._id,
      owner: room.owner._id,
      startDate,
      amount: room.price,
      paymentId: razorpay_payment_id,
    });

    // ================= SEND EMAIL =================
    await sendEmail(
      room.owner.email,
      "🎉 Your room has been booked",
      `
Hello ${room.owner.name},

Your room "${room.title}" has been booked.

Tenant: ${user.name}
Start Date: ${startDate}
Monthly Rent: ₹${room.price}

Regards,
RoomEase
`
    );

    res.json({
      success: true,
      message: "Booking successful",
      booking,
    });
  } catch (err) {
    console.error("Verify Payment Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
});

export default router;