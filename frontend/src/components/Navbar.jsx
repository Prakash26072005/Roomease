import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/RoomEase.png";
import api from "../utils/axios";
import { setIsLoggingOut } from "../utils/axios";
import AddIcon from '@mui/icons-material/Add';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
export default function Navbar() {
  const [query, setQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
useEffect(() => {
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);

        // 🔥 FORCE new reference (important)
        setUser({ ...parsed });
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  loadUser();

  window.addEventListener("userChanged", loadUser);

  return () => window.removeEventListener("userChanged", loadUser);
}, []);
  // ================= CLOSE DROPDOWN =================
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

const handleLogout = async () => {
  try {
    setIsLoggingOut(true);

    await api.post("/api/auth/logout");

    localStorage.removeItem("user");

    // 🔥 update navbar instantly
    window.dispatchEvent(new Event("userChanged"));

    window.location.replace("/login");
  } catch (err) {
    console.error(err);
  }
};
  const firstLetter = user?.name?.charAt(0).toUpperCase() || "U";

  // ================= SEARCH =================
  const onSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    navigate(`/?search=${query}`);
  };

  // ================= CHAT NAVIGATION =================
  const handleChatClick = () => {
    if (!user) {
      navigate("/login");
    } else {
 navigate(`/chatpage/${user._id}`);
    }
  };

  // ================= UI =================
  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" className="logo-img" />
        <h1 className="site-title">RoomEase</h1>

    
      </div>

      {/* SEARCH */}
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

      {/* RIGHT */}
      <div className="nav-right">
        <button className="icon-btn" onClick={() => navigate("/liked")}>
          <FavoriteBorderOutlinedIcon/>
        </button>

        <button className="icon-btn" onClick={handleChatClick}>
         <i class="ri-chat-3-line"></i>
        </button>

        <button
          className="icon-btn"
          onClick={() => navigate("/my-bookings")}
        >
         <CottageOutlinedIcon/>
        </button>

        {/* ================= PROFILE ================= */}
        { user && (
          <div className="profile-box" ref={dropdownRef}>
            <div
              className="profile-circle"
              onClick={() => setShowProfile((prev) => !prev)}
            >
              {firstLetter}
            </div>

            {showProfile && (
              <div className="dropdown">
                <div className="dropdown-header">{user.name}</div>

                <div
                  className="dropdown-item"
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/add");
                  }}
                >
                  ➕ Add your room
                </div>

                <div
                  className="dropdown-item"
                  onClick={() => {
                    setShowProfile(false);
                    navigate("/my-rooms");
                  }}
                >
                  📋 Added rooms
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= LOGIN / LOGOUT ================= */}
        {user ? (
  <button className="login-btn" onClick={handleLogout}>
    Logout
  </button>
) : (
  <button
    className="login-btn"
    onClick={() => navigate("/login")}
  >
    Login
  </button>
)}
      </div>
    </nav>
  );
}