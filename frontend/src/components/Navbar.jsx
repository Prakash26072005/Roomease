import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/RoomEase.png";


export default function Navbar() {
  const [query, setQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef();
  const navigate = useNavigate(); // ✅ React Router navigation

  // Load user
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }; 
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  // ✅ Login / Logout using navigate()
  const handleLoginLogout = () => {
    if (user) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");   // 👈 Redirect to login
    } else {
      navigate("/login");
    }
  };

  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  const onSearch = (e) => {
    e.preventDefault();
  };

  return (
    <nav className="navbar">

      {/* Left Side – Logo + Name */}
<div className="nav-left">
  <img src={logo} alt="Logo" className="logo-img" />
  <h1 className="site-title">RoomEase</h1>
  {/* Home button*/}
        <button
    className="home-btn"
    onClick={() => navigate("/")}
  >
    Home
  </button>
</div>
 
      {/* Center Search Bar */}
      <form className="search-form" onSubmit={onSearch}>
        <input
          className="search-input"
          type="text"
          placeholder="Search by city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">Search</button>
      </form>

      {/* Right Side Icons */}
      <div className="nav-right">

        {/* ❤️ Liked Homes → /liked */}
        <button
          className="icon-btn"
          title="Liked"
          onClick={() => navigate("/liked")}
        >
          ❤️
        </button>

        {/* 💬 Chats → /chats */}
        <button
          className="icon-btn"
          title="Chats"
          onClick={() => navigate("/chats")}
        >
          💬
        </button>

        {/* 🏨 Booked Rooms → /bookings */}
        <button
          className="icon-btn"
          title="Booked"
          onClick={() => navigate("/bookings")}
        >
          🏨
        </button>

        {/* Profile */}
        <div className="profile-box" ref={dropdownRef}>
          <div
            className="profile-circle"
            onClick={() => setShowProfile(!showProfile)}
          >
            {firstLetter}
          </div>

          {showProfile && (
            <div className="dropdown">
              <div className="dropdown-header">{user?.name || "User"}</div>

              <div
                className="dropdown-item"
                onClick={() => navigate("/add")}
              >
                ➕ Add your room
              </div>

              <div
                className="dropdown-item"
                onClick={() => navigate("/my-rooms")}
              >
                📋 Added rooms
              </div>
            </div>
          )}
        </div>

        {/* Login/Logout */}
        <button className="login-btn" onClick={handleLoginLogout}>
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </nav>
  );
}
