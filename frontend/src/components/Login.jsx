import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email || !name) {
      alert("Please enter name and email");
      return;
    }

    try {
      const res = await api.post("/api/auth/send-otp", { email, name });
      if (res.data.success) {
        setStep(2);
      }
    } catch {
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const res = await api.post("/api/auth/verify-otp", { email, otp });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        window.dispatchEvent(new Event("userChanged"));
        navigate("/");
      }
    } catch {
      alert("Invalid OTP");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="login-wrapper">

      {/* BACK */}
      <div className="back" onClick={() => navigate("/")}>
        ← Back to home
      </div>

      {/* CARD */}
      <div className="login-card">

        {/* ICON */}
        <div className="logo-box">
          <i className="ri-home-4-line"></i>
        </div>

        <h2>Welcome to RoomEase</h2>
        <p className="sub">Sign in to continue</p>

        {/* GOOGLE */}
        <button className="google-btn" onClick={handleGoogleLogin}>
          <i className="ri-google-fill"></i>
          Continue with Google
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

     {step === 1 ? (
  <>
    {/* NAME */}
    <label>Your Name</label>
    <div className="input-box">
      <i className="ri-user-3-line"></i>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>

    {/* EMAIL */}
    <label>Email Address</label>
    <div className="input-box">
      <i className="ri-mail-line"></i>
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>

    <button className="main-btn" onClick={sendOtp}>
      Send OTP
    </button>
  </>
) : (
  <>
    <label>Enter OTP</label>

    <div className="input-box">
      <i className="ri-key-line"></i>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
    </div>

    <button className="main-btn" onClick={verifyOtp}>
      Verify OTP
    </button>
  </>
)}

        <p className="terms">
          By continuing, you agree to RoomEase's{" "}
          <span>Terms</span> & <span>Privacy Policy</span>
        </p>

      </div>
    </div>
  );
}