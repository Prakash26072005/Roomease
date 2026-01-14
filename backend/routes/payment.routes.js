import express from "express";
import crypto from "crypto";
import razorpay from "../utils/razorpay.js";
import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();

/* ---------------- CREATE ORDER ---------------- */
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // rupees → paise
      currency: "INR",
    });

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

/* ---------------- VERIFY PAYMENT ---------------- */
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      roomId,
      userId,
      startDate,
    } = req.body;

    // 1️⃣ Verify Razorpay signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // 2️⃣ Fetch room & users
    const room = await Room.findById(roomId).populate("owner");
    const user = await User.findById(userId);

    if (!room || !user) {
      return res.status(404).json({ success: false, message: "Room/User not found" });
    }

    // 3️⃣ Save booking (MONTHLY RENT)
    const booking = await Booking.create({
      room: room._id,
      user: user._id,
      owner: room.owner._id,
      startDate,
      amount: room.price,
      paymentId: razorpay_payment_id,
    });

    // 4️⃣ Send email to OWNER
    await sendEmail(
      room.owner.email,
      "Your room has been booked 🎉",
      `Hello ${room.owner.name},

Your room "${room.title}" has been booked.

Tenant: ${user.name}
Start Date: ${startDate}
Monthly Rent: ₹${room.price}

Regards,
RoomEase`
    );

    res.json({ success: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment verification failed" });
  }
});

export default router;
