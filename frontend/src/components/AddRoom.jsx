import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import styles from "../styles/AddRoom.module.css";
import logo from "../assets/RoomEase.png";

export default function AddRoom() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    lat: "",
    lng: "",
  });
const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
   setImages(Array.from(e.target.files));
  };

  const getMyLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setData((prev) => ({
        ...prev,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }));
    });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true); // 🔥 START

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    const res = await api.post("/api/rooms/add", formData);

    if (res.data.success) {
      alert("Room added!");
      navigate("/my-rooms");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to add room");
  } finally {
    setLoading(false); // 🔥 END
  }
};

  return (
    <div className={styles.container}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <img src={logo} alt="logo" />
        <h2>Add New Room</h2>
        <p>Fill in the details to list your room</p>
      </div>

      {/* FORM CARD */}
      <form className={styles.form} onSubmit={handleSubmit}>
  {loading && (
    <div className={styles.overlayLoader}>
      <div className={styles.spinner}></div>
    </div>
  )}
        <h3>Basic Information</h3>

        {/* TITLE */}
        <label>Room Title</label>
        <div className={styles.inputBox}>
          <i className="ri-home-4-line"></i>
          <input
            name="title"
            placeholder="e.g., Cozy Studio in Downtown"
            onChange={handleChange}
            required
          />
        </div>

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          name="description"
          placeholder="Describe your room..."
          onChange={handleChange}
          required
        />

        {/* LOCATION */}
        <label>City / Location</label>
        <div className={styles.inputBox}>
          <i className="ri-map-pin-line"></i>
          <input
            name="address"
            placeholder="e.g., Mumbai, Bangalore"
            onChange={handleChange}
            required
          />
        </div>

        {/* PRICE */}
        <h3>Pricing</h3>
        <label>Price per Month</label>
        <div className={styles.inputBox}>
          <span>₹</span>
          <input
            name="price"
            type="number"
            placeholder="15000"
            onChange={handleChange}
            required
          />
        </div>

        {/* LOCATION DETAILS */}
        <h3>Location Details</h3>

        <label>Full Address</label>
        <div className={styles.inputBox}>
          <i className="ri-map-pin-line"></i>
          <input
            name="address"
            placeholder=" Street address, landmark"
            onChange={handleChange}
          />
        </div>

        <div className={styles.row}>
          <div>
            <label>Latitude</label>
            <input name="lat" value={data.lat} onChange={handleChange} />
          </div>

          <div>
            <label>Longitude</label>
            <input name="lng" value={data.lng} onChange={handleChange} />
          </div>
        </div>

        <button type="button" className={styles.locBtn} onClick={getMyLocation}>
           <span className={styles.red}><i class="ri-map-pin-4-fill"></i></span> Use My Location
        </button>

        {/* IMAGE */}
        <h3>Room Images</h3>
        <label className={styles.uploadBox}>
  <input
    type="file"
    multiple
    onChange={handleImages}
    accept="image/*"
  />
  <i className="ri-image-line"></i>
  <p>Drag & drop images here, or click to browse</p>
  <span>Support: JPG, PNG (max 5MB)</span>
</label>
{/* IMAGE PREVIEW */}
{images.length > 0 && (
  <div className={styles.previewContainer}>
    {images.map((img, i) => (
      <img
        key={i}
        src={URL.createObjectURL(img)}
        alt="preview"
        className={styles.previewImg}
      />
    ))}
  </div>
)}
        {/* BUTTONS */}
        <div className={styles.actions}>
          <button type="button" className={styles.cancel}>
            Cancel
          </button>

        <button type="submit" className={styles.submit} disabled={loading}>
  {loading ? "Adding..." : "Add Room"}
</button>
        </div>

      </form>
    </div>
  );
}