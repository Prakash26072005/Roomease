import React, { useState } from "react";

export default function RoomSlider({ images = [] }) {
  const [current, setCurrent] = useState(0);

  // ✅ SAFETY
  if (!images || images.length === 0) {
    return (
      <img
        src="https://via.placeholder.com/800x400"
        alt="room"
        style={{ width: "100%", borderRadius: "12px" }}
      />
    );
  }

  return (
    <div>
      {/* MAIN IMAGE */}
      <img
        src={images[current]}
        alt="room"
        style={{
          width: "100%",
          height: "400px",
          objectFit: "cover",
          borderRadius: "12px",
        }}
      />

      {/* THUMBNAILS */}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="thumb"
            onClick={() => setCurrent(i)}
            style={{
              width: "80px",
              height: "60px",
              objectFit: "cover",
              borderRadius: "8px",
              cursor: "pointer",
              border: current === i ? "2px solid blue" : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}