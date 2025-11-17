import express from "express";
import dotenv from "dotenv";
import { sendOtp, verifyOtp, googleLogin } from "../controllers/auth.controller.js";

dotenv.config();
const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/google-login", googleLogin);

export default router;
