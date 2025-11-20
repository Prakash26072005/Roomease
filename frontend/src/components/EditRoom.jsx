import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // <-- fetchRoom defined here
  const fetchRoom = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get(`http://localhost:5000/api/rooms/${id}`);
      if (res.data && res.data.success) {
        const room = res.data.room;
        setRoomData({
          title: room.title || "",
          description: room.description || "",
          price: room.price || "",
          location: room.location || "",
          images: Array.isArray(room.images) ? room.images : [],
        });
      } else {
        setError("Failed to load room data.");
      }
    } catch (err) {
      console.error("fetchRoom error:", err);
      setError(err.response?.data?.message || err.message || "Error fetching room");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();
      formData.append("title", roomData.title);
      formData.append("description", roomData.description);
      formData.append("price", roomData.price);
      formData.append("location", roomData.location);

      // If user selected new images, append them (backend replaces images if req.files.length > 0)
      if (newImages && newImages.length > 0) {
        for (let i = 0; i < newImages.length; i++) {
          formData.append("images", newImages[i]);
        }
      }

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:5000/api/rooms/edit/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data && res.data.success) {
        alert("Room updated!");
        navigate("/my-rooms");
      } else {
        setError(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error("update error:", err);
      setError(err.response?.data?.message || err.message || "Error updating room");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading room...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <h2>Edit Room</h2>

      {error && (
        <div style={{ color: "red", marginBottom: 12 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Title</label><br />
          <input
            type="text"
            value={roomData.title}
            onChange={(e) =>
              setRoomData({ ...roomData, title: e.target.value })
            }
            placeholder="Title"
            required
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Description</label><br />
          <textarea
            value={roomData.description}
            onChange={(e) =>
              setRoomData({ ...roomData, description: e.target.value })
            }
            placeholder="Description"
            required
            rows={4}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Price</label><br />
          <input
            type="number"
            value={roomData.price}
            onChange={(e) =>
              setRoomData({ ...roomData, price: e.target.value })
            }
            placeholder="Price"
            required
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Location</label><br />
          <input
            type="text"
            value={roomData.location}
            onChange={(e) =>
              setRoomData({ ...roomData, location: e.target.value })
            }
            placeholder="Location"
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Existing Images</label>
          <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
            {roomData.images && roomData.images.length > 0 ? (
              roomData.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`room-${idx}`}
                  width={120}
                  style={{ borderRadius: 6, objectFit: "cover" }}
                />
              ))
            ) : (
              <div>No images</div>
            )}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Upload New Images (optional — will replace old ones)</label><br />
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewImages(e.target.files)}
          />
          {newImages && newImages.length > 0 && (
            <div style={{ marginTop: 8 }}>
              {Array.from(newImages).map((f, i) => (
                <div key={i}>{f.name}</div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update Room"}
        </button>
      </form>
    </div>
  );
}
