// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// export default function RoomsPage() {
//   const [rooms, setRooms] = useState([]);

//   useEffect(() => {
//     fetch("http://localhost:5000/api/rooms/all")
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) setRooms(data.rooms);
//       });
//   }, []);

//   return (
//     <div style={{
//       display: "grid",
//       gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
//       gap: "20px",
//       padding: "20px"
//     }}>
//       {rooms.map(room => (
//         <Link
//           to={`/room/${room._id}`}
//           key={room._id}
//           style={{ textDecoration: "none" }}
//         >
//           <div style={{
//             borderRadius: "10px",
//             overflow: "hidden",
//             boxShadow: "0 0 10px rgba(0,0,0,0.2)"
//           }}>
//             <img
//               src={room.images?.[0]?.url || "https://via.placeholder.com/300"}
//               style={{
//                 width: "100%",
//                 height: "200px",
//                 objectFit: "cover"
//               }}
//             />
//             <div style={{ padding: "10px" }}>
//               <h3>{room.title}</h3>
//               <p>{room.location.address}</p>
//               <p><b>₹{room.price}</b> / month</p>
//             </div>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackImage =
    "https://via.placeholder.com/300x200?text=No+Image";

  // ================= FETCH ROOMS =================
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get("/api/rooms/all");

        if (res.data.success) {
          setRooms(res.data.rooms);
        }
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) return <h2 style={{ padding: 20 }}>Loading rooms...</h2>;

  // ================= UI =================
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px",
        padding: "20px",
      }}
    >
      {rooms.map((room) => (
        <Link
          to={`/room/${room._id}`}
          key={room._id}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            {/* IMAGE */}
            <img
              src={room.images?.[0]?.url || fallbackImage}
              alt={room.title}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />

            {/* DETAILS */}
            <div style={{ padding: "12px" }}>
              <h3 style={{ margin: "0 0 5px" }}>{room.title}</h3>

              <p style={{ margin: "0 0 5px", color: "#666" }}>
                {room.location?.address}
              </p>

              <p style={{ margin: 0, fontWeight: "bold" }}>
                ₹{room.price} / month
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}