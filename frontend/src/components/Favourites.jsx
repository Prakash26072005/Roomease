// import React, { useEffect, useState } from "react";
// import api from "../utils/axios";
// import "../styles/RoomPage.css"; // 🔥 SAME CSS use karo
// import { MdLocationOn } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { FaHeart } from "react-icons/fa";

// export default function Favorites() {
//   const [rooms, setRooms] = useState([]);
//   const navigate = useNavigate();

//   const fallbackImage =
//     "https://via.placeholder.com/300x200?text=No+Image";

//   // FETCH FAVORITES
//   useEffect(() => {
//     const fetchFavorites = async () => {
//       try {
//         const res = await api.get("/api/favorites/favorites");
//         if (res.data.success) {
//           setRooms(res.data.rooms);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchFavorites();
//   }, []);

//   // REMOVE FAVORITE
//   const removeFavorite = async (roomId, e) => {
//     e.stopPropagation();

//     try {
//       await api.post(`/api/favorites/toggle-favorite/${roomId}`);

//       setRooms((prev) => prev.filter((r) => r._id !== roomId));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="rooms-page">
//       {/* HEADER */}
//       <div className="rooms-header">
//         <h1>❤️ My Favorites</h1>
//         <p>Your saved rooms in one place</p>
//       </div>

//       {/* EMPTY */}
//       {rooms.length === 0 ? (
//         <p className="loading">No favorite rooms yet ❤️</p>
//       ) : (
//         <div className="rooms-grid">
//           {rooms.map((room) => (
//             <div
//               key={room._id}
//               className="room-card"
//               onClick={() => navigate(`/room/${room._id}`)}
//             >
//               {/* IMAGE */}
//               <div className="room-image-wrapper">
//                 <img
//                   src={room.images?.[0]?.url || fallbackImage}
//                   alt={room.title}
//                 />

//                 {/* ❤️ REMOVE */}
//                 <div
//                   className="heart-icon"
//                   onClick={(e) => removeFavorite(room._id, e)}
//                 >
//                   <FaHeart color="red" />
//                 </div>
//               </div>

//               {/* CONTENT */}
//               <div className="room-content">
//                 <h3>{room.title}</h3>

//                 <p className="location">
//                   <MdLocationOn />{" "}
//                   {room.location?.address || "No location"}
//                 </p>

//                 <p className="desc">
//                   {room.description?.slice(0, 80)}
//                 </p>

//                 <div className="room-footer">
//                   <span className="price">
//                     ₹{room.price} <small>/month</small>
//                   </span>

//                   <button
//                     className="chat-btn"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       navigate(`/room/${room._id}`);
//                     }}
//                   >
//                     View
//                   </button>
//                 </div>

//                 <p className="owner">
//                   Owner: {room.owner?.name || "Unknown"}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import api from "../utils/axios";
import "../styles/RoomPage.css"; // 🔥 SAME CSS use karo
import { MdLocationOn } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import Loader from "./Loader.jsx"; // path check kar lena
export default function Favorites() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
const [loading, setLoading] = useState(true);
  const fallbackImage =
    "https://via.placeholder.com/300x200?text=No+Image";

  // FETCH FAVORITES
  useEffect(() => {
  const fetchFavorites = async () => {
    try {
      const res = await api.get("/api/favorites/favorites");
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // 🔥 important
    }
  };

  fetchFavorites();
}, []);

  // REMOVE FAVORITE
  const removeFavorite = async (roomId, e) => {
    e.stopPropagation();

    try {
      await api.post(`/api/favorites/toggle-favorite/${roomId}`);

      setRooms((prev) => prev.filter((r) => r._id !== roomId));
    } catch (err) {
      console.error(err);
    }
  };
if (loading) return <Loader />;
  return (
    <div className="rooms-page">
      {/* HEADER */}
      <div className="rooms-header">
        <h1>❤️ My Favorites</h1>
        <p>Your saved rooms in one place</p>
      </div>

      {/* EMPTY */}
      {rooms.length === 0 ? (
        <p className="loading">No favorite rooms yet ❤️</p>
      ) : (
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="room-card"
              onClick={() => navigate(`/room/${room._id}`)}
            >
              {/* IMAGE */}
              <div className="room-image-wrapper">
                <img
                  src={room.images?.[0]?.url || fallbackImage}
                  alt={room.title}
                />

                {/* ❤️ REMOVE */}
                <div
                  className="heart-icon"
                  onClick={(e) => removeFavorite(room._id, e)}
                >
                  <FaHeart color="red" />
                </div>
              </div>

              {/* CONTENT */}
              <div className="room-content">
                <h3>{room.title}</h3>

                <p className="location">
                  <MdLocationOn />{" "}
                  {room.location?.address || "No location"}
                </p>

                <p className="desc">
                  {room.description?.slice(0, 80)}
                </p>

                <div className="room-footer">
                  <span className="price">
                    ₹{room.price} <small>/month</small>
                  </span>

                  <button
                    className="chat-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/room/${room._id}`);
                    }}
                  >
                    View
                  </button>
                </div>

                <p className="owner">
                  Owner: {room.owner?.name || "Unknown"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}