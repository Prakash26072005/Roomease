// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";
// import nodemailer from "nodemailer";
// import dotenv from "dotenv";

// dotenv.config();

// const isProd = process.env.NODE_ENV === "production";

// /* ================= EMAIL SETUP ================= */
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// /* ================= GENERATE TOKENS ================= */
// const generateTokens = (userId) => {
//   const accessToken = jwt.sign(
//     { id: userId },
//     process.env.JWT_SECRET,
//     { expiresIn: "15m" }
//   );

//   const refreshToken = jwt.sign(
//     { id: userId },
//     process.env.REFRESH_SECRET,
//     { expiresIn: "7d" }
//   );

//   return { accessToken, refreshToken };
// };

// /* ================= SET COOKIES ================= */
// const setCookies = (res, accessToken, refreshToken) => {
//   res.cookie("accessToken", accessToken, {
//     httpOnly: true,
//     sameSite: isProd ? "None" : "Lax",
//     secure: isProd,
//     maxAge: 15 * 60 * 1000, // 15 min
//   });

//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     sameSite: isProd ? "None" : "Lax",
//     secure: isProd,
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });
// };

// /* ================= REFRESH TOKEN ================= */
// export const refreshAccessToken = (req, res) => {
//   const token = req.cookies.refreshToken;

//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, message: "No refresh token" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

//     const accessToken = jwt.sign(
//       { id: decoded.id },
//       process.env.JWT_SECRET,
//       { expiresIn: "15m" }
//     );

//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       sameSite: isProd ? "None" : "Lax",
//       secure: isProd,
//       maxAge: 15 * 60 * 1000,
//     });

//     res.json({ success: true });
//   } catch {
//     return res
//       .status(401)
//       .json({ success: false, message: "Invalid refresh token" });
//   }
// };

// /* ================= SEND OTP ================= */
// export const sendOtp = async (req, res) => {
//   const { email, name } = req.body;

//   if (!email || !name) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Email & name required" });
//   }

//   try {
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiry = new Date(Date.now() + 5 * 60 * 1000);

//     let user = await User.findOne({ email });

//     if (!user) {
//       user = new User({ email, name });
//     } else {
//       user.name = name;
//     }

//     user.otp = otp;
//     user.otpExpiry = expiry;

//     await user.save();

//     try {
//       await transporter.sendMail({
//         from: `"RoomEase" <${process.env.EMAIL_USER}>`,
//         to: email,
//         subject: "Your OTP Code",
//         text: `Your OTP is ${otp}. It expires in 5 minutes.`,
//       });
//     } catch (emailErr) {
//       console.error("EMAIL ERROR:", emailErr);
//     }

//     res.json({ success: true, message: "OTP sent successfully" });
//   } catch (err) {
//     console.error("SEND OTP ERROR:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// /* ================= VERIFY OTP ================= */
// export const verifyOtp = async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user || !user.otp || !user.otpExpiry || user.otp !== otp) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid OTP" });
//     }

//     if (Date.now() > user.otpExpiry) {
//       return res
//         .status(400)
//         .json({ success: false, message: "OTP expired" });
//     }

//     user.otp = null;
//     user.otpExpiry = null;
//     await user.save();

//     const { accessToken, refreshToken } = generateTokens(user._id);

//     setCookies(res, accessToken, refreshToken);

//     res.json({
//       success: true,
//       user: {
//         _id: user._id,
//         email: user.email,
//         name: user.name,
//       },
//     });
//   } catch (err) {
//     console.error("VERIFY OTP ERROR:", err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// /* ================= GET ME ================= */
// export const getMe = (req, res) => {
//   res.json({
//     success: true,
//     user: req.user,
//   });
// };

// /* ================= LOGOUT ================= */
// export const logout = (req, res) => {
//   res.clearCookie("accessToken", {
//     httpOnly: true,
//     sameSite: isProd ? "None" : "Lax",
//     secure: isProd,
//   });

//   res.clearCookie("refreshToken", {
//     httpOnly: true,
//     sameSite: isProd ? "None" : "Lax",
//     secure: isProd,
//   });

//   res.json({
//     success: true,
//     message: "Logged out successfully",
//   });
// };

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

/* ================= EMAIL SETUP ================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= GENERATE TOKENS ================= */
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

/* ================= SET COOKIES ================= */
const setCookies = (res, accessToken, refreshToken) => {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "None",   // 🔥 FORCE
    secure: true,       // 🔥 FORCE
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
/* ================= REFRESH TOKEN ================= */
export const refreshAccessToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);

    const accessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

  res.cookie("accessToken", accessToken, {
  httpOnly: true,
  sameSite: "None",
  secure: true,
  maxAge: 15 * 60 * 1000,
});
    res.json({ success: true });
  } catch {
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
};

/* ================= SEND OTP ================= */
export const sendOtp = async (req, res) => {
  const { email, name } = req.body;

  if (!email || !name) {
    return res
      .status(400)
      .json({ success: false, message: "Email & name required" });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name });
    } else {
      user.name = name;
    }

    user.otp = otp;
    user.otpExpiry = expiry;

    await user.save();

    try {
      await transporter.sendMail({
        from: `"RoomEase" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      });
    } catch (emailErr) {
      console.error("EMAIL ERROR:", emailErr);
    }

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !user.otp || !user.otpExpiry || user.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP" });
    }

    if (Date.now() > user.otpExpiry) {
      return res
        .status(400)
        .json({ success: false, message: "OTP expired" });
    }

    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    setCookies(res, accessToken, refreshToken);

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ================= GET ME ================= */
export const getMe = (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

/* ================= LOGOUT ================= */
export const logout = (req, res) => {
res.clearCookie("accessToken", {
  httpOnly: true,
  sameSite: "None",
  secure: true,
});

res.clearCookie("refreshToken", {
  httpOnly: true,
  sameSite: "None",
  secure: true,
});
  res.json({
    success: true,
    message: "Logged out successfully",
  });
};