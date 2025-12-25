import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms/all")
      .then(res => res.json())
      .then(data => {
        if (data.success) setRooms(data.rooms);
      });
  }, []);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "20px",
      padding: "20px"
    }}>
      {rooms.map(room => (
        <Link
          to={`/room/${room._id}`}
          key={room._id}
          style={{ textDecoration: "none" }}
        >
          <div style={{
            borderRadius: "10px",
            overflow: "hidden",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)"
          }}>
            <img
              src={room.images?.[0]?.url || "https://via.placeholder.com/300"}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover"
              }}
            />
            <div style={{ padding: "10px" }}>
              <h3>{room.title}</h3>
              <p>{room.location}</p>
              <p><b>₹{room.price}</b> / month</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
