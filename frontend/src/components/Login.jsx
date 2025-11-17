// import React, { useState } from "react";
// import { loginWithGoogle } from "../firebase";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [otp, setOtp] = useState("");
//   const [step, setStep] = useState(1); // 1: enter email+name, 2: enter otp
//   const navigate = useNavigate();

//   const sendOtp = async () => {
//     if (!email || !name) return alert("Please enter name and email");
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/send-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, name }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("OTP sent to your email");
//         setStep(2);
//       } else {
//         alert(data.message || "Failed to send OTP");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error sending OTP");
//     }
//   };

//   const verifyOtp = async () => {
//     if (!otp) return alert("Enter OTP");
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         navigate("/dashboard");
//       } else {
//         alert(data.message || "OTP verification failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Error verifying OTP");
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       const result = await loginWithGoogle();
//       const user = result.user;
//       const res = await fetch("http://localhost:5000/api/auth/google-login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: user.email,
//           name: user.displayName,
//           googleId: user.uid,
//         }),
//       });
//       const data = await res.json();
//       if (data.success) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("user", JSON.stringify(data.user));
//         navigate("/");
//       } else {
//         alert(data.message || "Google login failed");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Google login failed");
//     }
//   };

//   return (
//     <div style={{ width: "320px", margin: "60px auto", textAlign: "center" }}>
//       <h2>Login</h2>

//       <div style={{ marginBottom: "18px" }}>
//         <button onClick={handleGoogleLogin}>Login with Google</button>
//       </div>

//       <hr />

//       {step === 1 ? (
//         <>
//           <h3>Email OTP Login</h3>
//           <input
//             type="text"
//             placeholder="Your name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             style={{ display: "block", width: "100%", marginBottom: "8px" }}
//           />
//           <input
//             type="email"
//             placeholder="Email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={{ display: "block", width: "100%", marginBottom: "8px" }}
//           />
//           <button onClick={sendOtp}>Send OTP</button>
//         </>
//       ) : (
//         <>
//           <h3>Enter OTP</h3>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             style={{ display: "block", width: "100%", marginBottom: "8px" }}
//           />
//           <button onClick={verifyOtp}>Verify OTP</button>
//         </>
//       )}
//     </div>
//   );
// }




import React, { useState } from "react";
import { loginWithGoogle } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!email || !name) return alert("Please enter name and email");
    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (data.success) {
        alert("OTP sent to your email");
        setStep(2);
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "OTP verification failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      const user = result.user;

      const res = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          name: user.displayName,
          googleId: user.uid,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        alert(data.message || "Google login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="login-container">

      {/* BACK ARROW */}
      <div className="back-arrow" onClick={() => navigate("/")}>
        ←----- back to main page
      </div>

      <h2 className="login-title">Login</h2>

      {/* GOOGLE LOGIN */}
      <button className="google-btn" onClick={handleGoogleLogin}>
        Login with Google
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
