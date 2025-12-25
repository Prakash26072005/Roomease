import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/rooms/my-rooms", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setRooms(data.rooms);
        else console.log(data);
      })
      .catch(err => console.log(err));
  }, []);

  const deleteRoom = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this room?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/api/rooms/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();

      if (data.success) {
        setRooms(prev => prev.filter(room => room._id !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const fallbackImage = "/fallback.jpg";

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Added Rooms</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "20px"
      }}>
        {rooms.map(room => (
          <div
            key={room._id}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/room/${room._id}`)}
            onKeyDown={(e) => { if (e.key === "Enter") navigate(`/room/${room._id}`); }}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              borderRadius: "10px",
              cursor: "pointer",
              userSelect: "none",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div style={{ width: "100%", height: 200, overflow: "hidden", borderRadius: 8 }}>
              <img
                src={room.images?.[0]?.url || fallbackImage}
                alt={room.title}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "8px 0" }}>{room.title}</h3>
              <p style={{ margin: 0, color: "#555" }}>{room.location}</p>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteRoom(room._id);
                }}
              >
                Delete
                +
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/edit/${room._id}`);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}