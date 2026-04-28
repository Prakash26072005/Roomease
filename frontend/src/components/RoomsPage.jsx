import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../utils/axios";
import "../styles/RoomPage.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { BiChat } from "react-icons/bi";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});
  const [visibleCount, setVisibleCount] = useState(8);

  const locationHook = useLocation();
  const queryParams = new URLSearchParams(locationHook.search);
  const location = queryParams.get("location") || "";

  const navigate = useNavigate();

  const fallbackImage =
    "https://via.placeholder.com/300x200?text=No+Image";

  // ================= HELPERS =================
  const getOwnerId = (owner) =>
    typeof owner === "object" ? owner?._id : owner;

  const getLoggedInUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [roomsRes, favRes] = await Promise.all([
          api.get(`/api/rooms/all?location=${location}`),
          api
            .get("/api/favorites/favorites")
            .catch(() => ({ data: { success: false, rooms: [] } })), // graceful fail
        ]);

        if (roomsRes.data.success) {
          setRooms(roomsRes.data.rooms);
        }

        if (favRes.data.success) {
          const likedMap = {};
          favRes.data.rooms.forEach((room) => {
            likedMap[room._id] = true;
          });
          setLiked(likedMap);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [location]);

  // ================= TOGGLE LIKE =================
  const toggleLike = async (roomId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await api.post(
        `/api/favorites/toggle-favorite/${roomId}`
      );

      if (res.data.success) {
        const likedMap = {};
        res.data.favorites.forEach((item) => {
          const id =
            typeof item === "object" ? item._id : item;
          likedMap[id] = true;
        });
        setLiked(likedMap);
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  // ================= CHAT =================
  const handleChatClick = (room, e) => {
    e.preventDefault();
    e.stopPropagation();

    const ownerId = getOwnerId(room.owner);
    const user = getLoggedInUser();

    if (!user?._id) return navigate("/login");
    if (!ownerId) return alert("Owner not found");
    if (String(ownerId) === String(user._id))
      return alert("You cannot chat with yourself");

    navigate(`/chatpage/${ownerId}`);
  };

  // ================= UI =================
  return (
    <div className="rooms-page">
      <div className="rooms-header">
        <h1>Find Your Perfect Room</h1>
        <p>Browse rooms available for rent</p>
      </div>

      <div className="rooms-grid">
        {loading
          ? Array(6)
              .fill()
              .map((_, i) => (
                <div className="room-card skeleton" key={i}></div>
              ))
          : rooms.slice(0, visibleCount).map((room) => (
              <Link
                to={`/room/${room._id}`}
                key={room._id}
                className="room-link"
              >
                <div className="room-card">
                  <div className="room-image-wrapper">
                    <img
                      src={
                        room.images?.[0]?.url ||
                        fallbackImage
                      }
                      alt={room.title}
                      loading="lazy"
                    />

                    <div
                      className="heart-icon"
                      onClick={(e) =>
                        toggleLike(room._id, e)
                      }
                    >
                      {liked[room._id] ? (
                        <FaHeart color="red" />
                      ) : (
                        <FaRegHeart />
                      )}
                    </div>
                  </div>

                  <div className="room-content">
                    <h3>{room.title}</h3>

                    <p className="location">
                      <MdLocationOn />{" "}
                      {room.location?.address ||
                        "No location"}
                    </p>

                    <p className="desc">
                      {room.description?.slice(0, 80) ||
                        "Well-furnished room"}
                    </p>

                    <div className="room-footer">
                      <span className="price">
                        ₹{room.price}{" "}
                        <small>/month</small>
                      </span>

                      <button
                        className="chat-btn"
                        onClick={(e) =>
                          handleChatClick(room, e)
                        }
                      >
                        <BiChat /> Chat
                      </button>
                    </div>

                    <p className="owner">
                      Owner:{" "}
                      {room.owner?.name || "Unknown"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
      </div>

      {/* LOAD MORE */}
      {!loading && visibleCount < rooms.length && (
       <div className="load-more">
  <button
    className="load-more-btn"
    onClick={() => setVisibleCount((prev) => prev + 8)}
  >
    Load More Rooms
  </button>
</div>
      )}
    </div>
  );
}