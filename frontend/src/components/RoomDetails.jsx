import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import RoomSlider from "./RoomSlider";

export default function RoomDetails() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/rooms/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setRoom(data.room);
      });
  }, [id]);

  if (!room) return <h1>Loading...</h1>;

  return (
    <div>
      {/* Send only URLs to RoomSlider */}
      <RoomSlider images={room.images.map(img => img.url)} />

      <h2>{room.title}</h2>
      <p>{room.location}</p>
      <p>{room.description}</p>
        <p><strong>Owner:</strong> {room.owner?.name}</p>
      <h3>₹{room.price} / night</h3>
    </div>
  );
}
