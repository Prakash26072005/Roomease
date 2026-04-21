import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
  sendOtp,
  verifyOtp,
  logout,
  refreshAccessToken,
  getMe,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();
const CLIENT_URL = process.env.CLIENT_URL;

/* ================= GOOGLE LOGIN ================= */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/* ================= GOOGLE CALLBACK ================= */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  failureRedirect: `${CLIENT_URL}/login`,
  }),
  (req, res) => {
    const user = req.user;

    const accessToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );
const isProd = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  sameSite: "None",
  secure: true,
};

    // ✅ ONLY THIS (correct)
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // res.redirect("http://localhost:5173");
    res.redirect(`${CLIENT_URL}/google-success`);
  }
);

/* ================= OTP ================= */
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

/* ================= AUTH ================= */
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);

/* ================= USER ================= */
router.get("/me", verifyToken, getMe);

export default router;