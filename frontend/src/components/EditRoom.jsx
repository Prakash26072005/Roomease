import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import styles from "../styles/AddRoom.module.css"; // reuse same css
import logo from "../assets/RoomEase.png";
import Loader from "./Loader";
export default function EditRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    title: "",
    description: "",
    price: "",
    address: "",
    lat: "",
    lng: "",
  });

  const [images, setImages] = useState([]);       // existing
  const [newImages, setNewImages] = useState([]); // new upload
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/api/rooms/${id}`);

        if (res.data.success) {
          const room = res.data.room;

          setData({
            title: room.title || "",
            description: room.description || "",
            price: room.price || "",
            address: room.location?.address || "",
            lat: room.location?.lat || "",
            lng: room.location?.lng || "",
          });

          setImages(room.images || []);
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load room");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  // ================= INPUT =================
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  // ================= LOCATION =================
  const getMyLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setData((prev) => ({
        ...prev,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }));
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      newImages.forEach((img) => {
        formData.append("images", img);
      });

      const res = await api.put(`/api/rooms/edit/${id}`, formData);

      if (res.data.success) {
        alert("Room updated!");
        navigate("/my-rooms");
      }
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setSubmitting(false);
    }
  };
if (loading) return <Loader />;

  return (
    <div className={styles.container}>
      
      {/* HEADER */}
      <div className={styles.header}>
        <img src={logo} alt="logo" />
        <h2>Edit Room</h2>
        <p>Update your room details</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>

        <h3>Basic Information</h3>

        {/* TITLE */}
        <label>Room Title</label>
        <div className={styles.inputBox}>
          <i className="ri-home-4-line"></i>
          <input
            name="title"
            value={data.title}
            onChange={handleChange}
          />
        </div>

        {/* DESCRIPTION */}
        <label>Description</label>
        <textarea
          name="description"
          value={data.description}
          onChange={handleChange}
        />

        {/* ADDRESS */}
        <label>Location</label>
        <div className={styles.inputBox}>
          <i className="ri-map-pin-line"></i>
          <input
            name="address"
            value={data.address}
            onChange={handleChange}
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
            value={data.price}
            onChange={handleChange}
          />
        </div>

        {/* LOCATION DETAILS */}
        <h3>Location Details</h3>

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
          📍 Use My Location
        </button>

        {/* EXISTING IMAGES */}
        <h3>Existing Images</h3>
        <div className={styles.previewContainer}>
          {images.map((img, i) => (
            <img key={i} src={img.url} className={styles.previewImg} />
          ))}
        </div>

        {/* NEW UPLOAD */}
        <h3>Upload New Images</h3>
        <label className={styles.uploadBox}>
          <input type="file" multiple onChange={handleImages} />
          <i className="ri-image-line"></i>
          <p>Upload new images</p>
        </label>

        {/* NEW PREVIEW */}
        {newImages.length > 0 && (
          <div className={styles.previewContainer}>
            {newImages.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                className={styles.previewImg}
              />
            ))}
          </div>
        )}

        {/* BUTTONS */}
        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={() => navigate(-1)}>
            Cancel
          </button>

          <button type="submit" className={styles.submit}>
            {submitting ? "Updating..." : "Update Room"}
          </button>
        </div>

      </form>
    </div>
  );
}