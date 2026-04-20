// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../utils/axios";
// import "../styles/RoomPage.css";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import { MdLocationOn } from "react-icons/md";
// import { BiChat } from "react-icons/bi";
// import Loader from "./Loader.jsx";

// export default function RoomsPage() {
//   const [rooms, setRooms] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [liked, setLiked] = useState({});
//   const navigate = useNavigate();

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
//         console.error("Fetch rooms error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRooms();
//   }, []);

//   // ================= FETCH FAVORITES =================
// useEffect(() => {
//   const fetchFavorites = async () => {
//     try {
//       const res = await api.get("/api/favorites/favorites");

//       if (res.data.success) {
//         const likedMap = {};

//         res.data.rooms.forEach((room) => {
//           likedMap[room._id] = true;
//         });

//         setLiked(likedMap);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   fetchFavorites();
// }, []);

//   // ================= TOGGLE LIKE =================
// const toggleLike = async (roomId, e) => {
//   e.preventDefault();
//   e.stopPropagation();

//   try {
//     const res = await api.post(`/api/favorites/toggle-favorite/${roomId}`);

//     if (res.data.success) {
//       const likedMap = {};

//       res.data.favorites.forEach((item) => {
//         const id = typeof item === "object" ? item._id : item;
//         likedMap[id] = true;
//       });

//       setLiked(likedMap);
//     }
//   } catch (err) {
//     console.error("Toggle error:", err);
//   }
// };

//   // ================= LOADING =================
//   // if (loading) {
//   //   return <h2 className="loading">Loading rooms...</h2>;
//   // }
// if (loading) {
//   return <Loader />;
// }

//   // ================= UI =================
//   return (
//     <div className="rooms-page">
//       {/* HEADER */}
//       <div className="rooms-header">
//         <h1>Find Your Perfect Room</h1>
//         <p>
//           Browse through our curated list of rooms available for rent
//         </p>
//       </div>

//       {/* GRID */}
//       <div className="rooms-grid">
//         {rooms.map((room) => (
//           <Link
//             to={`/room/${room._id}`}
//             key={room._id}
//             className="room-link"
//           >
//             <div className="room-card">
//               {/* IMAGE */}
//               <div className="room-image-wrapper">
//                 <img
//                   src={
//                     room.images?.[0]?.url || fallbackImage
//                   }
//                   alt={room.title}
//                 />

//                 {/* ❤️ HEART */}
//                 <div
//                   className="heart-icon"
//                   onClick={(e) => toggleLike(room._id, e)}
//                 >
//                   {liked[room._id] ? (
//                     <FaHeart color="red" />
//                   ) : (
//                     <FaRegHeart />
//                   )}
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
//                   {room.description?.slice(0, 80) ||
//                     "Well-furnished room with great amenities."}
//                 </p>

//                 {/* PRICE + CHAT */}
//                 <div className="room-footer">
//                   <span className="price">
//                     ₹{room.price} <small>/month</small>
//                   </span>

//                   <button
//                     className="chat-btn"
//                     onClick={(e) => {
//                       e.preventDefault();
//                       e.stopPropagation();
//                       navigate(
//                         `/chatpage/${room.owner?._id}`
//                       );
//                     }}
//                   >
//                     <BiChat /> Chat
//                   </button>
//                 </div>

//                 <p className="owner">
//                   Owner: {room.owner?.name || "Unknown"}
//                 </p>
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axios";
import "../styles/RoomPage.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { BiChat } from "react-icons/bi";
import Loader from "./Loader.jsx";
import { useLocation } from "react-router-dom";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState({});
  const locationHook = useLocation();
const queryParams = new URLSearchParams(locationHook.search);
const location = queryParams.get("location") || "";
  const navigate = useNavigate();

  const fallbackImage =
    "https://via.placeholder.com/300x200?text=No+Image";

  // ================= FETCH ROOMS =================
useEffect(() => {
  const fetchRooms = async () => {
    setLoading(true);

    try {
      const res = await api.get(
        `/api/rooms/all?location=${location}`
      );

      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error("Fetch rooms error:", err);
    } finally {
      setLoading(false);
    }
  };

  const delay = setTimeout(fetchRooms, 500); // debounce

  return () => clearTimeout(delay);
}, [location]);
  // ================= FETCH FAVORITES =================
useEffect(() => {
  const fetchFavorites = async () => {
    try {
      const res = await api.get("/api/favorites/favorites");

      if (res.data.success) {
        const likedMap = {};

        res.data.rooms.forEach((room) => {
          likedMap[room._id] = true;
        });

        setLiked(likedMap);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchFavorites();
}, []);

  // ================= TOGGLE LIKE =================
const toggleLike = async (roomId, e) => {
  e.preventDefault();
  e.stopPropagation();

  try {
    const res = await api.post(`/api/favorites/toggle-favorite/${roomId}`);

    if (res.data.success) {
      const likedMap = {};

      res.data.favorites.forEach((item) => {
        const id = typeof item === "object" ? item._id : item;
        likedMap[id] = true;
      });

      setLiked(likedMap);
    }
  } catch (err) {
    console.error("Toggle error:", err);
  }
};

  // ================= LOADING =================
  // if (loading) {
  //   return <h2 className="loading">Loading rooms...</h2>;
  // }
if (loading) {
  return <Loader />;
}

  // ================= UI =================
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
                  src={
                    room.images?.[0]?.url || fallbackImage
                  }
                  alt={room.title}
                />

                {/* ❤️ HEART */}
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
                  <MdLocationOn />{" "}
                  {room.location?.address || "No location"}
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
                      e.stopPropagation();
                      navigate(
                        `/chatpage/${room.owner?._id}`
                      );
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