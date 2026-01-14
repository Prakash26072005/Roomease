import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/RoomEase.png";
import { getValidUser } from "../utils/auth";

export default function Navbar() {
  const [query, setQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // ✅ Load user safely (check token expiry)
  useEffect(() => {
    const validUser = getValidUser();
    setUser(validUser);
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

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";

  const onSearch = (e) => {
    e.preventDefault();
  };

  return (
    <nav className="navbar">
      {/* Left Side */}
      <div className="nav-left">
        <img src={logo} alt="Logo" className="logo-img" />
        <h1 className="site-title">RoomEase</h1>

        <button className="home-btn" onClick={() => navigate("/")}>
          Home
        </button>
      </div>

      {/* Search */}
      <form className="search-form" onSubmit={onSearch}>
        <input
          className="search-input"
          type="text"
          placeholder="Search by city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {/* Right Side */}
      <div className="nav-right">
        <button className="icon-btn" onClick={() => navigate("/liked")}>❤️</button>
        <button className="icon-btn" onClick={() => navigate("/chats")}>💬</button>
        <button className="icon-btn" onClick={() => navigate("/my-bookings")}>🏨</button>

        {/* Profile */}
        {user && (
          <div className="profile-box" ref={dropdownRef}>
            <div
              className="profile-circle"
              onClick={() => setShowProfile(!showProfile)}
            >
              {firstLetter}
            </div>

            {showProfile && (
              <div className="dropdown">
                <div className="dropdown-header">{user.name}</div>

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
        )}

        {/* Login / Logout */}
        {user ? (
          <button className="login-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
