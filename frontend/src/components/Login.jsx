// // 


// import React, { useState } from "react";
// import { loginWithGoogle } from "../firebase";
// import { useNavigate } from "react-router-dom";
// import api from "../utils/axios";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState(1);
//   const navigate = useNavigate();

//   const sendOtp = async () => {
//     const res = await api.post("/api/auth/send-otp", { email, name });
//     if (res.data.success) setStep(2);
//   };

//   const verifyOtp = async () => {
//     const res = await api.post("/api/auth/verify-otp", { email, otp });

//     if (res.data.success) {
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       navigate("/");
//       window.location.reload();
//     }
//   };

//   const handleGoogleLogin = async () => {
//     const result = await loginWithGoogle();
//     const user = result.user;

//     const res = await api.post("/api/auth/google-login", {
//       email: user.email,
//       name: user.displayName,
//       googleId: user.uid,
//     });

//     if (res.data.success) {
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       navigate("/");
//       window.location.reload();
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleGoogleLogin}>Google Login</button>

//       {step === 1 ? (
//         <>
//           <input onChange={(e)=>setName(e.target.value)} />
//           <input onChange={(e)=>setEmail(e.target.value)} />
//           <button onClick={sendOtp}>Send OTP</button>
//         </>
//       ) : (
//         <>
//           <input onChange={(e)=>setOtp(e.target.value)} />
//           <button onClick={verifyOtp}>Verify</button>
//         </>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  // ================= SEND OTP =================
  const sendOtp = async () => {
    if (!email || !name) {
      alert("Please enter name and email");
      return;
    }

    try {
      const res = await api.post("/api/auth/send-otp", {
        email,
        name,
      });

      if (res.data.success) {
        alert("OTP sent to your email");
        setStep(2);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      const res = await api.post("/api/auth/verify-otp", {
        email,
        otp,
      });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/");
 window.location.reload();
        
      }
    } catch (err) {
      console.error(err);
      alert("OTP verification failed");
    }
  };

  // ================= GOOGLE OAUTH =================
  const handleGoogleLogin = () => {
    // 🔥 redirect to backend OAuth route
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  // ================= UI =================
  return (
    <div className="login-container">
      <div className="back-arrow" onClick={() => navigate("/")}>
        ← Back to Home
      </div>

      <h2 className="login-title">Login</h2>

      {/* 🔥 GOOGLE OAUTH BUTTON */}
      <button className="google-btn" onClick={handleGoogleLogin}>
        Continue with Google
      </button>

      <hr />

      {step === 1 ? (
        <>
          <h3>Email OTP Login</h3>

          <input
            type="text"
            className="login-input"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            className="login-input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="login-btn" onClick={sendOtp}>
            Send OTP
          </button>
        </>
      ) : (
        <>
          <h3>Enter OTP</h3>

          <input
            type="text"
            className="login-input"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button className="login-btn" onClick={verifyOtp}>
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}