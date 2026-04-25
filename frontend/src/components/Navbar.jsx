import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/RoomEase.png";
import api from "../utils/axios";
import { setIsLoggingOut } from "../utils/axios";

import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import CottageOutlinedIcon from '@mui/icons-material/CottageOutlined';
export default function Navbar() {
  const [query, setQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
const menuBtnRef = useRef(null);
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

  navigate(`/?location=${query}`);
};
  // ================= CHAT NAVIGATION =================
  const handleChatClick = () => {
    if (!user) {
      navigate("/login");
    } else {
 navigate("/chatpage");
    }
  };
  useEffect(() => {
  const handleOutsideClick = (e) => {
    // agar click menu ke andar hai → ignore
    if (menuRef.current && menuRef.current.contains(e.target)) {
      return;
    }

    // agar click hamburger icon pe hai → ignore
    if (menuBtnRef.current && menuBtnRef.current.contains(e.target)) {
      return;
    }

    // otherwise → close menu
    setShowMenu(false);
  };

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);

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
<div 
  className="menu-icon" 
  ref={menuBtnRef}
  onClick={() => setShowMenu(!showMenu)}
>
  <i className="ri-menu-line"></i>
</div>
{showMenu && (
  <div 
    className="menu-overlay" 
    onClick={() => setShowMenu(false)}
  />
)}
     <div 
  className={`nav-right ${showMenu ? "active" : ""}`} 
  ref={menuRef}   // ✅ ADD THIS
>
<button className="icon-btn" onClick={() => navigate("/favorites")}>
  <FavoriteBorderOutlinedIcon />
  <span className="icon-text">Favorites</span>
</button>

<button className="icon-btn" onClick={handleChatClick}>
  <i className="ri-chat-3-line"></i>
  <span className="icon-text">Chat</span>
</button>

<button
  className="icon-btn"
  onClick={() => navigate("/my-bookings")}
>
  <CottageOutlinedIcon />
  <span className="icon-text">Bookings</span>
</button>

        {/* ================= PROFILE ================= */}
        { user && (
          <div className="profile-box" ref={dropdownRef}>
          <div
  className="profile-circle"
  onClick={() => setShowProfile((prev) => !prev)}
>
  {firstLetter}

  {/* ✅ Add this */}
  <span className="profile-name">{user?.name}</span><span><i class="ri-arrow-down-line"></i></span>
</div>

           {showProfile && (
  <div className="dropdown">

    {/* HEADER */}
    <div className="dropdown-header">
      <i className="ri-user-3-line"></i>
  
      <span>{user.name}</span>
    </div>

    <div className="dropdown-divider"></div>

    {/* ADD ROOM */}
    <div
      className="dropdown-item"
      onClick={() => {
        setShowProfile(false);
        navigate("/add");
      }}
    >
      <i className="ri-add-line"></i>
      <span>Add Room</span>
    </div>

    {/* MY ROOMS */}
    <div
      className="dropdown-item"
      onClick={() => {
        setShowProfile(false);
        navigate("/my-rooms");
      }}
    >
      <i className="ri-menu-fold-fill"></i>
      <span>My Rooms</span>
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
