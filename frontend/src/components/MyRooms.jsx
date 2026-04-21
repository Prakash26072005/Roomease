import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MyRooms.module.css";
import Loader from "./Loader.jsx";
import api from "../utils/axios";
export default function MyRooms() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
const [loading, setLoading] = useState(true);
 useEffect(() => {
  const fetchRooms = async () => {
    try {
      const res = await api.get("/api/rooms/my-rooms");

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
const deleteRoom = async (id) => {
  if (!window.confirm("Delete this room?")) return;

  try {
    const res = await api.delete(`/api/rooms/delete/${id}`);

    if (res.data.success) {
      setRooms((prev) => prev.filter((r) => r._id !== id));
    }
  } catch (err) {
    console.error(err);
  }
};


  const fallbackImage = "/fallback.jpg";

  if (loading) return <Loader />;
  return (
    <div className={styles.container}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <div>
          <h2>My Rooms</h2>
          <p>Manage your room listings</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() =>navigate("/add")}
        >
          <i className="ri-add-large-line"></i> Add New Room
        </button>
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {rooms.map((room) => (
          <div
            key={room._id}
            className={styles.card}
            onClick={() => navigate(`/room/${room._id}`)}
          >
            
            {/* IMAGE */}
            <div className={styles.imageWrapper}>
              <img
                src={room.images?.[0]?.url || fallbackImage}
                alt={room.title}
              />
            </div>

            {/* CONTENT */}
            <div className={styles.content}>
              <h3>{room.title}</h3>

              <p className={styles.location}>
                <i className="ri-map-pin-line"></i>
                {room.location?.address}
              </p>

              <p className={styles.price}>
                ₹ {room.price} <span>/month</span>
              </p>
            </div>

            {/* ACTIONS */}
            <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
              
              <button
                className={styles.editBtn}
                onClick={() => navigate(`/edit/${room._id}`)}
              >
                <i className="ri-edit-box-line"></i> Edit
              </button>

              <button
                className={styles.deleteBtn}
                onClick={() => deleteRoom(room._id)}
              >
                <i className="ri-delete-bin-6-line"></i> Delete
              </button>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}