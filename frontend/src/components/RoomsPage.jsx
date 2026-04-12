// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import api from "../utils/axios";

// export default function RoomsPage() {
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fallbackImage =
//     "https://via.placeholder.com/300x200?text=No+Image";

//   // ================= FETCH ROOMS =================
//   useEffect(() => {
//     const fetchRooms = async () => {
//       try {
//         const res = await api.get("/api/rooms/all");

//         if (res.data.success) {
//           setRooms(res.data.rooms);
//         }
//       } catch (err) {
//         console.error("Error fetching rooms:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   if (loading) return <h2 style={{ padding: 20 }}>Loading rooms...</h2>;

//   // ================= UI =================
//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//         gap: "20px",
//         padding: "20px",
//       }}
//     >
//       {rooms.map((room) => (
//         <Link
//           to={`/room/${room._id}`}
//           key={room._id}
//           style={{ textDecoration: "none", color: "inherit" }}
//         >
//           <div
//             style={{
//               borderRadius: "12px",
//               overflow: "hidden",
//               boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//               transition: "transform 0.2s ease",
//             }}
//             onMouseEnter={(e) =>
//               (e.currentTarget.style.transform = "scale(1.03)")
//             }
//             onMouseLeave={(e) =>
//               (e.currentTarget.style.transform = "scale(1)")
//             }
//           >
//             {/* IMAGE */}
//             <img
//               src={room.images?.[0]?.url || fallbackImage}
//               alt={room.title}
//               style={{
//                 width: "100%",
//                 height: "200px",
//                 objectFit: "cover",
//               }}
//             />

//             {/* DETAILS */}
//             <div style={{ padding: "12px" }}>
//               <h3 style={{ margin: "0 0 5px" }}>{room.title}</h3>

//               <p style={{ margin: "0 0 5px", color: "#666" }}>
//                 {room.location?.address}
//               </p>

//               <p style={{ margin: 0, fontWeight: "bold" }}>
//                 ₹{room.price} / month
//               </p>
//             </div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }

import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import "../styles/RoomPage.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { BiChat } from "react-icons/bi";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});
const navigate=useNavigate();
  const fallbackImage =
    "https://via.placeholder.com/300x200?text=No+Image";

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/api/rooms/all");
        if (res.data.success) {
          setRooms(res.data.rooms);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const toggleLike = (id, e) => {
    e.preventDefault();
    setLiked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <h2 className="loading">Loading rooms...</h2>;

  return (
    <div className="rooms-page">
      {/* HEADER */}
      <div className="rooms-header">
        <h1>Find Your Perfect Room</h1>
        <p>
          Browse through our curated list of rooms available for rent
        </p>
      </div>

      {/* GRID */}
      <div className="rooms-grid">
        {rooms.map((room) => (
          <Link
            to={`/room/${room._id}`}
            key={room._id}
            className="room-link"
          >
            <div className="room-card">
              {/* IMAGE */}
              <div className="room-image-wrapper">
                <img
                  src={room.images?.[0]?.url || fallbackImage}
                  alt={room.title}
                />

                {/* HEART */}
                <div
                  className="heart-icon"
                  onClick={(e) => toggleLike(room._id, e)}
                >
                  {liked[room._id] ? (
                    <FaHeart color="red" />
                  ) : (
                    <FaRegHeart />
                  )}
                </div>
              </div>

              {/* CONTENT */}
              <div className="room-content">
                <h3>{room.title}</h3>

                <p className="location">
                  <MdLocationOn /> {room.location?.address}
                </p>

                <p className="desc">
                  {room.description?.slice(0, 80) ||
                    "Well-furnished room with great amenities."}
                </p>

                {/* PRICE + CHAT */}
                <div className="room-footer">
                  <span className="price">
                    ₹{room.price} <small>/month</small>
                  </span>
<button
  className="chat-btn"
  onClick={(e) => {
    e.preventDefault();
    navigate(`/chatpage/${room.owner._id}`);
  }}
>
  <BiChat /> Chat
</button>
                </div>

                <p className="owner">
                  Owner: {room.owner?.name || "Unknown"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}