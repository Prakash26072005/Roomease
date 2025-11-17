import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtp = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) return res.status(400).json({ success: false, message: "Email and name required" });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    let user = await User.findOne({ email });
    if (!user) user = new User({ email, name });
    else user.name = name; // update name if provided

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await transporter.sendMail({
      from: `"Auth App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("sendOtp err:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found" });

    if (!user.otp || !user.otpExpiry) return res.status(400).json({ success: false, message: "OTP expired or not generated" });
    if (user.otp !== otp) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (Date.now() > new Date(user.otpExpiry)) return res.status(400).json({ success: false, message: "OTP expired" });

    // OTP valid -> clear OTP and issue token with user._id
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({
      success: true,
      token,
      user: { email: user.email, name: user.name, googleId: user.googleId || null },
    });
  } catch (err) {
    console.error("verifyOtp err:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const googleLogin = async (req, res) => {
  const { email, name, googleId } = req.body;
  if (!email || !googleId) return res.status(400).json({ success: false, message: "Invalid data" });

  try {
    let user = await User.findOne({ googleId });
    if (!user) {
      // try by email (if previously registered via email OTP)
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        if (!user.name && name) user.name = name;
        await user.save();
      } else {
        user = new User({ email, name, googleId });
        await user.save();
      }
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: { email: user.email, name: user.name, googleId: user.googleId },
    });
  } catch (err) {
    console.error("googleLogin err:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
